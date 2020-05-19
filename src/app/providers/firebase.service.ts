import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, DocumentData, QuerySnapshot, Query, SetOptions, DocumentReference } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import * as _ from 'lodash';
import { Appointment, Patient } from '../patient.model';
import { UserData } from './user-data';

const setOptions : SetOptions = {merge: true};
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public user: UserData
  ){}

  getTracks() {
    return new Promise<any>((resolve, reject) => {
      this.afs.collection('procedures').doc("procedure").ref.get().then((querySnapshot: DocumentSnapshot<any>) => {
        let docA: DocumentData = querySnapshot.data();
        let procedures = docA["procedures"];
        resolve(procedures);
      })
    })
  }

  createAppointment(value: Appointment){
    return new Promise<any>((resolve, reject) => {
      value.id = this.getAppointmentKey(value.name, value.birthdate, value.procedureStartDateTime);
      let patient = this.transformAppointmentToPatient(value);
      // todo reuse old procedures
      const patDocRef: DocumentReference = firebase.firestore().doc("patients" + "/" + patient.id);
      patDocRef.set(patient, setOptions)
      .catch((err) => {
          console.log("Error updating info about a patient :" + patient.id + " with message " + err);
      });

      const docRef: DocumentReference = firebase.firestore().doc("appointments" + "/" + value.id );
      docRef.set(value, setOptions).
      then(
        res => resolve(res),
        err => reject(err))
      .catch((err) => {
          console.log("Error updating info about a vehicle :" + value.id + " with message " + err);
      });

      
    })
  }

  transformAppointmentToPatient(appointment: Appointment): Patient {
    let appointments: Appointment[] = [];
    appointments.push(appointment);
    return {
      ...new Patient(),
      id: this.getPatientKey(appointment.name, appointment.birthdate),
      name: appointment.name,
      birthdate: appointment.birthdate,
      phone: appointment.phone,
      email: appointment.email,
      procedures: appointment.procedures,
      appointments: appointments,
    };
  }

  getPatientKey(patientName: string, birthDate: Date){
    let key = '';
    if(patientName){
      key = patientName;
    }
    if(birthDate){
      key = key+"-"+this.formatDate(birthDate);
    }

    if(key.trim().length == 0){
      return 'key';
    }

    return key.trim().toLowerCase();
  }

  getAppointmentKey(patientName: string, birthDate: Date, startDate: Date){
    let key = this.getPatientKey(patientName, birthDate);
    if(startDate){
      key = key+"-"+this.formatDate(startDate);
    }

    if(key.trim().length == 0){
      return 'key';
    }

    return key.trim().toLowerCase();
  }

  getTimelineFromFirebase(
    startDate: Date,
    endDate: Date,
    queryText = '',
    excludeTracks: any[] = [],
  ): Promise<Map<String, Appointment[]>> {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    return new Promise<Map<String, Appointment[]>>((resolve, reject) => {
      let appointmentsMap: Map<String, Appointment[]> = new Map<String, Appointment[]>();

      let query: Query = this.afs.collection('appointments').ref
        //where('name', '>=', queryText); -- firebase does not allow
        .where('procedureStartDateTime', '>=', startDate)
        .where('procedureStartDateTime', '<=', endDate);
      if(false){
        query = query.where('procedures', 'array-contains',['Rinoplastie secundară', 'Abdominoplastie radicală + Cura herniei ombilicale (cu dr. Ralea)']);
      }

      query
        .get()
        .then((querySnapshot: QuerySnapshot<any>) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let data = doc.data();
            let appoinment: Appointment = new Appointment();
            appoinment = _.merge({}, appoinment, data);
            appoinment.birthdate = data.birthdate.toDate();
            appoinment.procedureStartDateTime = data.procedureStartDateTime.toDate();
            appoinment.procedureEndDateTime = data.procedureEndDateTime.toDate();

            let dateKey = this.formatDate(appoinment.procedureStartDateTime);
            if(!appointmentsMap.has(dateKey)){
              appointmentsMap.set(dateKey, []);
            }
            let appointmentPerDay : Appointment[] = appointmentsMap.get(dateKey);
            this.filterSession(appoinment, queryWords, excludeTracks);
            appointmentPerDay.push(appoinment);
          });
          resolve(appointmentsMap);
        });
    });
  }

  getPatientsFromFirebase(
    queryText = '',
    excludeTracks: any[] = [],
  ) {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    return new Promise<any>((resolve, reject) => {
      let appointmentsMap: Map<String, Appointment[]> = new Map<String, Appointment[]>();
      let query: Query = this.afs.collection('appointments').ref.
          where('name', '>=', queryText);
      if(true){
        query = query.where('procedures', 'array-contains',['west_coast', 'east_coast']);
      }
      query.get()
        .then((querySnapshot: QuerySnapshot<any>) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            let data = doc.data();
            let appoinment: Appointment = new Appointment();
            appoinment = _.merge({}, appoinment, data);
            let dateKey = this.formatDate(appoinment.procedureStartDateTime);
            if(!appointmentsMap.has(dateKey)){
              appointmentsMap.set(dateKey, []);
            }
            let appointmentPerDay : Appointment[] = appointmentsMap.get(dateKey);
            this.filterSession(appoinment, queryWords, excludeTracks);
            appointmentPerDay.push(appoinment);
          });
        });
      resolve(appointmentsMap);
    });
  }

  filterSession(
    session: Appointment,
    queryWords: string[],
    excludeTracks: any[],
  ) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach((queryWord: string) => {
        if (session.name.toLowerCase().indexOf(queryWord.toLowerCase()) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }

    // if any of the sessions tracks are not in the
    // exclude tracks then this session passes the track test
    let matchesTracks = false;
    session.procedures.forEach((procedureName: string) => {
      if (excludeTracks.indexOf(procedureName) === -1) {
        matchesTracks = true;
      }
    });

    // all tests must be true if it should not be hidden
    session.hide = !(matchesQueryText && matchesTracks);
  }


  getTasks(){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('tasks').snapshotChanges();
          resolve(this.snapshotChangesSubscription);
        }
      })
    })
  }

  getTask(taskId){
    return new Promise<any>((resolve, reject) => {
      this.afAuth.user.subscribe(currentUser => {
        if(currentUser){
          this.snapshotChangesSubscription = this.afs.doc<any>('people/' + currentUser.uid + '/tasks/' + taskId).valueChanges()
          .subscribe(snapshots => {
            resolve(snapshots);
          }, err => {
            reject(err)
          })
        }
      })
    });
  }

  unsubscribeOnLogOut(){
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  updateTask(taskKey, value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  deleteTask(taskKey){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).delete()
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  createTask(value){
    return new Promise<any>((resolve, reject) => {
      let currentUser = firebase.auth().currentUser;
      this.afs.collection('people').doc(currentUser.uid).collection('tasks').add({
        title: value.title,
        description: value.description,
        image: value.image
      })
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  encodeImageUri(imageUri, callback) {
    var c = document.createElement('canvas');
    var ctx = c.getContext("2d");
    var img = new Image();
    img.onload = function () {
      var aux:any = this;
      c.width = aux.width;
      c.height = aux.height;
      ctx.drawImage(img, 0, 0);
      var dataURL = c.toDataURL("image/jpeg");
      callback(dataURL);
    };
    img.src = imageUri;
  };

  uploadImage(imageURI, randomId){
    return new Promise<any>((resolve, reject) => {
      let storageRef = firebase.storage().ref();
      let imageRef = storageRef.child('image').child(randomId);
      this.encodeImageUri(imageURI, function(image64){
        imageRef.putString(image64, 'data_url')
        .then(snapshot => {
          snapshot.ref.getDownloadURL()
          .then(res => resolve(res))
        }, err => {
          reject(err);
        })
      })
    })
  }

  formatDate(date: Date) {
    var month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
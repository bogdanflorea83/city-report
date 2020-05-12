import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import * as _ from 'lodash';
import { Appointment } from '../patient.model';
import { UserData } from './user-data';

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
      //let currentUser = firebase.auth().currentUser;
      this.afs.collection('appointments').add(value)
      .then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }

  getTimelineFromFirebase(
    startDate: Date,
    endDate: Date,
    queryText = '',
    excludeTracks: any[] = [],
  ) {
    queryText = queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    const queryWords = queryText.split(' ').filter(w => !!w.trim().length);

    return new Promise<any>((resolve, reject) => {
      let appointmentsMap: Map<String, Appointment[]> = new Map<String, Appointment[]>();

      this.afs.collection('appointments').ref.where('procedureStartDateTime', '>=', startDate).
        where('procedureStartDateTime', '<=', endDate).get()
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
      if (excludeTracks.indexOf(procedureName.toLowerCase()) === -1) {
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
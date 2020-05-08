import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from '../../patient.model';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {

    genders: Array<string>;

    isReadyToSave: boolean;

    username: '';
      name: '';
      lastname: '';
      email: '';
      gender: '';
      terms: false;
  
    form = this.formBuilder.group({
      username: [null, [Validators.required]],
      name: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, [Validators.required]],
      gender: [null, [Validators.required]],
      terms: [null, [Validators.required]],
  });

    constructor(
      private router: Router,
      protected formBuilder: FormBuilder,
      protected toastCtrl: ToastController,
    ) { 
      // Watch the form for changes, and
      this.form.valueChanges.subscribe((v) => {
        this.isReadyToSave = this.form.valid;
    });
    }
  
    ngOnInit() {
      //  We just use a few random countries, however, you can use the countries you need by just adding them to this list.
      // also you can use a library to get all the countries from the world.
     
  
      this.genders = [
        "Male",
        "Female"
      ];

    }
  
    onSubmit(values){
      console.log(values);
      this.router.navigate(["/app/tabs/schedule"]);
    }

    save(){
      const patient = this.createFromForm();
      console.log(JSON.stringify(patient));
      this.onSaveSuccess();
    }

    async onSaveSuccess() {
      const toast = await this.toastCtrl.create({message: `Pacient salvat cu success.`, duration: 2000, position: 'middle'});
      toast.present();
      this.router.navigate(["/app/tabs/schedule"]);
  }

    private createFromForm(): Patient {

      let procedures: [] = [];
      procedures.push[this.form.get(['username']).value];
      return {
          ...new Patient(),
          id: null,
          name: this.form.get(['username']).value,
          birthdate: null,
          phone: this.form.get(['username']).value,
          procedures: procedures,
      };
  }
  
  }
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient, Appointment } from '../../patient.model';
import { ToastController } from '@ionic/angular';
import { AssetsService } from '../../providers/assets.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {

  isReadyToSave: boolean;

  existingProceduresCatalog: Array<string>;

  currentDate = '2020-10-31';

  appointmentDateValue;

  name: '';
  birthdate: '';
  phone: '';
  appointmentDate;
  appointmentDateTime;
  appointmentProcedures: Array<string>;
  appointmentDuration: '';
  diagnostic: '';
  notes: '';

  form = this.formBuilder.group({
    name: [null, [Validators.required]],
    birthdate: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    appointmentDate: [null, [Validators.required]],
    appointmentDateTime: [null, [Validators.required]],
    appointmentProcedures: [null, [Validators.required]],
    appointmentDuration: [null, [Validators.required]],
    diagnostic: [null, [Validators.required]],
    notes: [null, [Validators.required]],
  });

  constructor(
    private router: Router,
    protected formBuilder: FormBuilder,
    protected toastCtrl: ToastController,
    private assetsService: AssetsService,
  ) {
    this.currentDate = this.formatDate(new Date);
    this.existingProceduresCatalog = this.assetsService.procedures;
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit(){

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

  ionViewWillEnter() {
    this.existingProceduresCatalog = this.assetsService.procedures;
  }

  onSubmit(values) {
    console.log(values);
    this.router.navigate(["/app/tabs/schedule"]);
  }

  save() {
    const patient = this.createFromForm();
    console.log(JSON.stringify(patient));
    this.onSaveSuccess();
  }

  async onSaveSuccess() {
    const toast = await this.toastCtrl.create({ message: `Pacient salvat cu success.`, duration: 2000, position: 'middle' });
    toast.present();
    this.router.navigate(["/app/tabs/schedule"]);
  }

  private createFromForm(): Appointment {
    //let procedures: [] = [];
    //procedures.push[this.form.get(['name']).value];
    return {
      ...new Appointment(),
      id: null,
      name: this.form.get(['name']).value,
      birthdate: this.form.get(['birthdate']).value,
      phone: this.form.get(['phone']).value,
      procedure: null,
      procedures: this.form.get(['appointmentProcedures']).value,
      procedureStartDateTime: new Date(),
      procedureEndDateTime: new Date(),
      procedureMonth: 0,
      diagnostic: this.form.get(['diagnostic']).value,
      notes: this.form.get(['notes']).value,
    };
  }

  appointmentDateSelected($event){
    this.appointmentDateValue = $event.detail.value;
  }

  cancel(){
    this.router.navigate(["/app/tabs/schedule"]);
  }

}
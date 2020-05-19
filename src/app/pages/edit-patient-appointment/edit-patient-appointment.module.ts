import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPatientAppointmentPageRoutingModule } from './edit-patient-appointment-routing.module';

import { EditPatientAppointmentPage } from './edit-patient-appoinment.page';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { ProceduresAutocompleteService } from '../../providers/procedures-autocomplete.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditPatientAppointmentPageRoutingModule,
    AutoCompleteModule,
  ],
  providers: [
    ProceduresAutocompleteService
  ],
  declarations: [EditPatientAppointmentPage]
})
export class EditPatientAppointmentPageModule {}

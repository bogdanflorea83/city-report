import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPatientPageRoutingModule } from './add-patient-routing.module';

import { AddPatientPage } from './add-patient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddPatientPageRoutingModule
  ],
  declarations: [AddPatientPage]
})
export class AddPatientPageModule {}

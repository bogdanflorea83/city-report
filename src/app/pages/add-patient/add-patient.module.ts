import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPatientPageRoutingModule } from './add-patient-routing.module';

import { AddPatientPage } from './add-patient.page';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { ProceduresAutocompleteService } from '../../providers/procedures-autocomplete.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddPatientPageRoutingModule,
    AutoCompleteModule,
  ],
  providers: [
    ProceduresAutocompleteService
  ],
  declarations: [AddPatientPage]
})
export class AddPatientPageModule {}

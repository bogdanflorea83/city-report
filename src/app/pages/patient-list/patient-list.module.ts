import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PatientListPage } from './patient-list';
import { PatientListPageRoutingModule } from './patient-list-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PatientListPageRoutingModule
  ],
  declarations: [PatientListPage],
})
export class PatientListModule {}

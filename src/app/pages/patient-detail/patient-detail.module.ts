import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientDetailPage } from './patient-detail';
import { PatientDetailPageRoutingModule } from './patient-detail-routing.module';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PatientDetailPageRoutingModule
  ],
  declarations: [
    PatientDetailPage,
  ]
})
export class PatientDetailModule { }

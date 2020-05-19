import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { AboutModule } from '../about/about.module';
import { MapModule } from '../map/map.module';
import { ScheduleModule } from '../schedule/schedule.module';
import { SessionDetailModule } from '../session-detail/session-detail.module';
import { PatientDetailModule } from '../patient-detail/patient-detail.module';
import { PatientListModule } from '../patient-list/patient-list.module';
import { AddPatientPageModule } from '../add-patient/add-patient.module';
import { EditPatientAppointmentPageModule } from '../edit-patient-appointment/edit-patient-appointment.module';

@NgModule({
  imports: [
    AboutModule,
    CommonModule,
    IonicModule,
    MapModule,
    ScheduleModule,
    SessionDetailModule,
    PatientDetailModule,
    PatientListModule,
    AddPatientPageModule,
    EditPatientAppointmentPageModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
  ]
})
export class TabsModule { }

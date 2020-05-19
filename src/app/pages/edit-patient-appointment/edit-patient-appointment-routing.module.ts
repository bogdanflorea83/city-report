import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPatientAppointmentPage } from './edit-patient-appoinment.page';

const routes: Routes = [
  {
    path: '',
    component: EditPatientAppointmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPatientAppointmentPageRoutingModule {}

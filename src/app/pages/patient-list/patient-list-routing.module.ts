import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PatientListPage } from './patient-list';
const routes: Routes = [
  {
    path: '',
    component: PatientListPage,
    children: [
          
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientListPageRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProblemsPage } from './problems';

const routes: Routes = [
  {
    path: '',
    component: ProblemsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProblemsPageRoutingModule { }

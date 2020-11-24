import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicProblemsPage } from './public-problems';
const routes: Routes = [
  {
    path: '',
    component: PublicProblemsPage,
    children: [
          
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicProblemsPageRoutingModule {}

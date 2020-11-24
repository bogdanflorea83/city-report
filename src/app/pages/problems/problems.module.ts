import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ProblemsPage } from './problems';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ProblemsPageRoutingModule } from './problems-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProblemsPageRoutingModule
  ],
  declarations: [
    ProblemsPage,
    ScheduleFilterPage
  ],
  entryComponents: [
    ScheduleFilterPage
  ]
})
export class ProblemsModule { }

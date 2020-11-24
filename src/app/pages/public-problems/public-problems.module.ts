import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PublicProblemsPage } from './public-problems';
import { PublicProblemsPageRoutingModule } from './public-problems-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PublicProblemsPageRoutingModule
  ],
  declarations: [PublicProblemsPage],
})
export class PublicProblemsModule {}

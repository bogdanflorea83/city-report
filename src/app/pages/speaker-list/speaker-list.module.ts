import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { SpeakerListPage } from './speaker-list';
import { SpeakerListPageRoutingModule } from './speaker-list-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SpeakerListPageRoutingModule
  ],
  declarations: [SpeakerListPage],
})
export class SpeakerListModule {}

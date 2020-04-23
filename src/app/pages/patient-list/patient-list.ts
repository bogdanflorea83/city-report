import { Component, OnInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import { ModalController, IonRouterOutlet } from '@ionic/angular';
import { Router } from '@angular/router';
import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';

@Component({
  selector: 'page-patient-list',
  templateUrl: 'patient-list.html',
  styleUrls: ['./patient-list.scss'],
})
export class PatientListPage implements OnInit {
  speakers: any[] = [];
  queryText = '';
  showSearchbar: boolean;
  excludeTracks: any = [];

  constructor(public confData: ConferenceData, 
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,) {}

  ionViewDidEnter() {
    //this.getSpeakersFromDatabase();
  }

  ngOnInit() {
    this.getSpeakersFromDatabase();
  }

  updatePatients() {
    this.getSpeakersFromDatabase();
  }

  getSpeakersFromDatabase(){
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      let filteredSpekers = [];
      speakers.forEach((speaker: any) => {
        if (this.queryText.length == 0 || speaker.name.toLowerCase().indexOf(this.queryText.toLowerCase()) > -1) {
          filteredSpekers.push(speaker);
        }
      });
      this.speakers = filteredSpekers;
    });
  }

  async presentFilter() {
    const modal = await this.modalCtrl.create({
      component: ScheduleFilterPage,
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
      componentProps: { excludedTracks: this.excludeTracks }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) {
      this.excludeTracks = data;
      this.updateSchedule();
    }
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    // if (this.scheduleList) {
    //   this.scheduleList.closeSlidingItems();
    // }

    // this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
    //   this.shownSessions = data.shownSessions;
    //   this.groups = data.groups;
    // });
  }
}

import { Component } from '@angular/core';
import { Config, ModalController, NavParams } from '@ionic/angular';

import { ConferenceData } from '../../providers/conference-data';
import { FirebaseService } from '../../providers/firebase.service';


@Component({
  selector: 'page-schedule-filter',
  templateUrl: 'schedule-filter.html',
  styleUrls: ['./schedule-filter.scss'],
})
export class ScheduleFilterPage {
  ios: boolean;

  tracks: {name: string, icon: string, isChecked: boolean}[] = [];
  tracks2: {name: string, icon: string, isChecked: boolean}[] = [];


  constructor(
    public confData: ConferenceData,
    private config: Config,
    private firebaseService: FirebaseService,
    public modalCtrl: ModalController,
    public navParams: NavParams
  ) { }

  ionViewWillEnter() {
    this.ios = this.config.get('mode') === `ios`;

    // passed in array of track names that should be excluded (unchecked)
    const excludedTrackNames = this.navParams.get('excludedTracks');

    this.confData.getTracks().subscribe((tracks: any[]) => {
      tracks.forEach(track => {
        this.tracks.push({
          name: track.name,
          icon: track.icon,
          isChecked: (excludedTrackNames.indexOf(track.name) === -1)
        });
      });
    });

    this.firebaseService.getTracks().then((tracks: any[]) => {
      tracks.forEach(track => {
        console.log(track);
        this.tracks.push({
          name: track,
          icon: null,
          isChecked: (excludedTrackNames.indexOf(track) === -1)
        });
      });
    });
  }

  selectAll(check: boolean) {
    // set all to checked or unchecked
    this.tracks.forEach(track => {
      track.isChecked = check;
    });
  }

  applyFilters() {
    // Pass back a new array of track names to exclude
    const excludedTrackNames = this.tracks.filter(c => !c.isChecked).map(c => c.name);
    this.dismiss(excludedTrackNames);
  }

  dismiss(data?: any) {
    // using the injected ModalController this page
    // can "dismiss" itself and pass back data
    this.modalCtrl.dismiss(data);
  }
}

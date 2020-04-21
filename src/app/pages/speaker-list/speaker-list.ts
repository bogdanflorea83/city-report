import { Component, OnInit } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-speaker-list',
  templateUrl: 'speaker-list.html',
  styleUrls: ['./speaker-list.scss'],
})
export class SpeakerListPage implements OnInit {
  speakers: any[] = [];
  queryText = '';
  showSearchbar: boolean;

  constructor(public confData: ConferenceData) {}

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
}

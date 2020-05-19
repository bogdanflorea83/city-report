import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { Appointment } from '../../patient.model';

@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
  styleUrls: ['./schedule.scss'],
})
export class SchedulePage implements OnInit {
  // Gets a reference to the list element
  @ViewChild('scheduleList', { static: true }) scheduleList: IonList;

  startDate = '2020-10-31';
  endDate = '2020-10-31';

  ios: boolean;
  dayIndex = 0;
  queryText = '';
  segment = 'all';
  excludeTracks: any = [];
  shownSessions: number = 0;
  groups: any[] = [];
  confDate: string;
  showSearchbar: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public confData: ConferenceData,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public router: Router,
    public routerOutlet: IonRouterOutlet,
    public toastCtrl: ToastController,
    public user: UserData,
    public config: Config
  ) {
    this.startDate = this.formatDate(new Date());
    this.endDate = this.formatDate(this.addDays(new Date(), 28));
   }

  ngOnInit() {
    this.updateSchedule();

    this.ios = this.config.get('mode') === 'ios';
  }

  onCancelFilter() {
    this.showSearchbar = false;
    this.queryText = '';
    this.updateSchedule();
  }

  updateSchedule() {
    // Close any open sliding items when the schedule updates
    if (this.scheduleList) {
      this.scheduleList.closeSlidingItems();
    }

    // this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
    //   this.shownSessions = data.shownSessions;
    //   this.groups = data.groups;
    // });
    let startDate = new Date(this.startDate);
    startDate.setHours(0, 1, 1);
    let endDate = new Date(this.endDate);
    endDate.setHours(23, 59, 59);
    this.confData.getTimelineFromFirebase(startDate, endDate, 
      this.queryText, this.excludeTracks).then((data: Map<String, Appointment[]>) => {
        let newShownSessions = 0;
        let newGroups: any[] = [];
      data.forEach((value: Appointment[], key: string) => {
        let groupHide = true;
        value.forEach((app: Appointment) => {
          if(!app.hide){
            newShownSessions = newShownSessions+1;
            groupHide = false;
          }
        });
        newGroups.push({
          hide: groupHide,
          sessions: value,
          time: this.getDayLabel(key)
        });
      });
      this.shownSessions = newShownSessions;
      this.groups = newGroups;
    });
  }

  getDayLabel(groupDate: string): String {
    let date = new Date(groupDate);
    let day = date.getDay();
    switch (day) {
      case 0:
        return "Duminica " + groupDate
      case 1:
        return "Luni " + groupDate
      case 2:
        return "Marti " + groupDate
      case 3:
        return "Miercuri " + groupDate
      case 4:
        return "Joi " + groupDate
      case 5:
        return "Vineri " + groupDate
      case 6:
        return "Sambata " + groupDate
      default:
        return groupDate;
    }
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

  async addFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any) {
    if (this.user.hasFavorite(sessionData.name)) {
      // Prompt to remove favorite
      this.removeFavorite(slidingItem, sessionData, 'Favorite already added');
    } else {
      // Add as a favorite
      this.user.addFavorite(sessionData.name);

      // Close the open item
      slidingItem.close();

      // Create a toast
      const toast = await this.toastCtrl.create({
        header: `${sessionData.name} was successfully added as a favorite.`,
        duration: 3000,
        buttons: [{
          text: 'Close',
          role: 'cancel'
        }]
      });

      // Present the toast at the bottom of the page
      await toast.present();
    }

  }

  async removeFavorite(slidingItem: HTMLIonItemSlidingElement, sessionData: any, title: string) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this session from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // they want to remove this session from their favorites
            this.user.removeFavorite(sessionData.name);
            this.updateSchedule();

            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async openSocial(network: string, fab: HTMLIonFabElement) {
    const loading = await this.loadingCtrl.create({
      message: `Posting to ${network}`,
      duration: (Math.random() * 1000) + 500
    });
    await loading.present();
    await loading.onWillDismiss();
    fab.close();
  }

  formatDate(date: Date) {
    if(!date){
      return '';
    }
    var month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  formatTime(date: Date) {
    if(!date){
      return '';
    }
    var hours = '' + date.getHours(),
      minutes = '' + date.getMinutes();
    if (hours.length < 2)
      hours = '0' + hours;
    if (minutes.length < 2)
      minutes = '0' + minutes;

    return [hours, minutes].join('-');
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }

  getDayOfWeek(data){
    if(!data.procedureStartDateTime){
      return 0;
    }
    

    return data.procedureStartDateTime.getDay();
  }
}

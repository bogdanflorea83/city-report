import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';
import { ActivatedRoute } from '@angular/router';
import { UserData } from '../../providers/user-data';
import { ToastController, ModalController } from '@ionic/angular';
import { ImageModalPage } from '../image-modal/image-modal.page';

@Component({
  selector: 'page-session-detail',
  styleUrls: ['./session-detail.scss'],
  templateUrl: 'session-detail.html'
})
export class SessionDetailPage {
  session: any;
  isFavorite = false;
  defaultHref = '';

  sliderOpts={
    zoom: false,
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 20,
    passiveListeners: false,
  }

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private modalController: ModalController
  ) { 
    
  }

  ionViewWillEnter() {
    const sessionId = this.route.snapshot.paramMap.get('sessionId');
    this.session = this.dataProvider.getAppointmentFromCache(sessionId);
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/schedule`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    if (this.userProvider.hasFavorite(this.session.name)) {
      this.userProvider.removeFavorite(this.session.name);
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(this.session.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share session');
  }

  async phoneCall(){
    if(!this.session.phoneNumber){
      const toast = await this.toastCtrl.create({ message: `Pacientul nu are numar de telefon inregistrat.`, duration: 2000, position: 'middle' });
      toast.present();
    }else{
      console.log('phone call');
    }
  }

 

  openPreview(img){
    this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        img: img
      },
      cssClass: "modal-fullscreen"
    }).then(modal => modal.present());
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
}

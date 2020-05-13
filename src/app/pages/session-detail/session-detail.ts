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
    this.dataProvider.load().subscribe((data: any) => {
      if (data && data.schedule && data.schedule[0] && data.schedule[0].groups) {
        const sessionId = this.route.snapshot.paramMap.get('sessionId');
        for (const group of data.schedule[0].groups) {
          if (group && group.sessions) {
            for (const session of group.sessions) {
              if (session && session.id === sessionId) {
                this.session = session;

                this.isFavorite = this.userProvider.hasFavorite(
                  this.session.name
                );

                break;
              }
            }
          }
        }
      }
    });
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
}

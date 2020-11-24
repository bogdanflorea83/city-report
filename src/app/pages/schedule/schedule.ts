import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonList, IonRouterOutlet, LoadingController, ModalController, ToastController, Config } from '@ionic/angular';

import { ScheduleFilterPage } from '../schedule-filter/schedule-filter';
import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';
import { Appointment } from '../../patient.model';
import { ExcelServiceService } from '../../providers/excel-service.service';

import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { File } from '@ionic-native/file/ngx';

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
    public config: Config,
    public excelService: ExcelServiceService,
    private emailComposer: EmailComposer,
    private file: File
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

    this.confData.getTimeline(this.dayIndex, this.queryText, this.excludeTracks, this.segment).subscribe((data: any) => {
      this.shownSessions = data.shownSessions;
      this.groups = data.groups;
    });
    // let startDate = new Date(this.startDate);
    // startDate.setHours(0, 1, 1);
    // let endDate = new Date(this.endDate);
    // endDate.setHours(23, 59, 59);
    // this.confData.getTimelineFromFirebase(startDate, endDate, 
    //   this.queryText, this.excludeTracks).then((data: Map<String, Appointment[]>) => {
    //     let newShownSessions = 0;
    //     let newGroups: any[] = [];
    //   data.forEach((value: Appointment[], key: string) => {
    //     let groupHide = true;
    //     value.forEach((app: Appointment) => {
    //       if(!app.hide){
    //         newShownSessions = newShownSessions+1;
    //         groupHide = false;
    //       }
    //     });
    //     newGroups.push({
    //       hide: groupHide,
    //       sessions: value,
    //       time: this.getDayLabel(key)
    //     });
    //   });
    //   this.shownSessions = newShownSessions;
    //   this.groups = newGroups;
    // });
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

  getCategoryType(group){
    // if(!group.time){
    //   return 0;
    // }
    
    // //return data.group[0];

    return Math.floor( Math.random() * 6 );
  }

  exportHtml() {
    this.prepareHtmlTable().then((htmlBody) => {

      let time = new Date();
      let title = "Agenda Doctor Mazilu ";
      if(this.startDate == this.endDate){
        title += this.startDate;
      }else{
        title += this.startDate + "->" + this.endDate;
      }

      let email = {
        to: "bogdan.florea@tss-yonder.com",
        //attachments: [fp],
        subject: title,
        //body: '<h1>Buna ziua, acesta este programul meu pentru perioada ' + this.startDate + "->" + this.endDate+'</h1>',
        body: htmlBody,
        isHtml: true
      };
      this.emailComposer.open(email)

        .then(() => {  })
        .catch(() => {

          // const toast = await this.toastCtrl.create({
          //   message: 'Could not open email composer',
          //   duration: 3000
          // });
          // await toast.present();


        });


    }).catch(err => {
      console.log('Error when writing file: ', err);
    });
}

  exportXlsx() {
    this.prepareDataForXlsx().then((rows) => {

      //let fs = this.file.externalDataDirectory;

      let fs = this.file.tempDirectory;//this.file.cacheDirectory;


      this.excelService.createXSLX(rows).then((x) => {
      console.log('Excel blob: ', x);
  
      let time = new Date();
      let title = "Agenda Doctor Mazilu ";
      if(this.startDate == this.endDate){
        title += this.startDate;
      }else{
        title += this.startDate + "->" + this.endDate;
      }

      let fileName = title + ".xlsx";

      this.file.writeFile(fs, fileName, x, { replace: true }).then(f => {
        console.log('Returned from writing file: ', f);
  
        let fp = fs + fileName;
  
        let email = {
          to: "bogdan.florea@tss-yonder.com",
          attachments: [fp],
          subject: title,
          body: '<h1>Buna ziua, acesta este programul meu pentru perioada ' + this.startDate + "->" + this.endDate+'</h1>',
          isHtml: true
        };
        this.emailComposer.open(email)
  
          .then(() => {  })
          .catch(() => {
  
            // const toast = await this.toastCtrl.create({
            //   message: 'Could not open email composer',
            //   duration: 3000
            // });
            // await toast.present();

  
          });
  
  
      }).catch(err => {
        console.log('Error when writing file: ', err);
      });
  
  
    });
  });

    
  }

  prepareDataForXlsx(){
    //arrays => [[‘Head1’,‘Head2’,‘Head3’],[‘val1’,‘val2’,‘val3’]]
    return new Promise<any>((resolve, reject) => {
      let result = [];
      let columnNames = ["NUME SI PRENUME","TELEFON","ZIUA OP","ORA OP","NOTITE","DIAGNOSTIC BLOC OPERATOR", "COD PROCEDURA CONSILIERE"];
      this.groups.forEach((group) => {
        if(!group.hide){
          group.sessions.forEach((session: Appointment) => {
            if(!session.hide){
              let itemValue = [];
            itemValue.push(session.name);
            itemValue.push(session.phone);
            itemValue.push(session.procedureStartDateTime);
            itemValue.push(session.procedureStartDateTime);
            itemValue.push(session.notes);
            itemValue.push(session.diagnostic);
            let procedure = '';
            if(session.procedures != null){
              session.procedures.forEach((procedureName: string) => {
                procedure = procedure + procedureName + "/";
              });
            }
            itemValue.push(procedure);
    
            //let itemResult = [];
            //itemResult.push(columnNames);
            //itemResult.push(itemValue);
            //result.push(itemResult);
            result.push(columnNames);
            result.push(itemValue);

            }
            
          });
        }
      });
      resolve(result);
    });
  }

  prepareHtmlTable(){
    return new Promise<any>((resolve, reject) => {
      let result = [];
      let columnNames = ["NUME SI PRENUME","TELEFON","ZIUA OP","ORA OP","NOTITE","DIAGNOSTIC BLOC OPERATOR", "COD PROCEDURA CONSILIERE"];
      let html = '<html>'; 
      html += '<h1>Buna ziua, acesta este programul meu pentru perioada ' + this.startDate + "->" + this.endDate+'</h1>';

      html += '<body><table border = "1" cellpadding = "5" cellspacing = "5">';
      html += '<tr style="color: red;">';

      columnNames.forEach((column) => {
        html += "<th>"+column+"</th>";
      });
      html += "</tr>";
      this.groups.forEach((group) => {
        if(!group.hide){
          group.sessions.forEach((session: Appointment) => {
            if(!session.hide){
              html += "<tr>"
            html += "<td>"+session.name+"</td>";
            html += "<td>"+session.phone+"</td>";
            html += "<td>"+this.formatDate(session.procedureStartDateTime)+"</td>";
            html += "<td>"+this.formatTime(session.procedureStartDateTime)+"</td>";
            html += "<td>"+session.notes+"</td>";
            html += "<td>"+session.diagnostic+"</td>";

            let procedure = '';
            if(session.procedures != null){
              session.procedures.forEach((procedureName: string) => {
                procedure = procedure + procedureName + "/";
              });
            }
            html += "<td>"+procedure+"</td>";
            html += "</tr>";
            }
            
          });
        }
      });
      html += "</table>";
      html += "</body>";
      html += "</html>";
      
      resolve(html);
    });
  }
    
}

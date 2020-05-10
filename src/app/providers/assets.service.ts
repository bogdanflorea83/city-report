import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  procedures: any[] = [];

  constructor(private firebaseService: FirebaseService,) { 
    
  }

  init(){
    this.firebaseService.getTracks().then((tracks: any[]) => {
      this.procedures = tracks;
    });
  }

}

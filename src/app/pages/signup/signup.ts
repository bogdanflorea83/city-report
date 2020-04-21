import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthService } from '../../providers/auth.service';



@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  styleUrls: ['./signup.scss'],
})
export class SignupPage {
  signup: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public router: Router,
    public userData: UserData,
    private authService: AuthService,
  ) {}

  onSignup(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.tryRegister({email: this.signup.username, password: this.signup.password});
    }
  }

  tryRegister(value){
    this.authService.doRegister(value)
     .then(res => {
      this.userData.signup(this.signup.username);
      this.router.navigateByUrl('/app/tabs/schedule');
       console.log(res);
     }, err => {
       console.log(err);
     })
  }
}

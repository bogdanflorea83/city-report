import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AuthService } from '../../providers/auth.service';
import { AssetsService } from '../../providers/assets.service';



@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login: UserOptions = { username: '', password: '' };
  submitted = false;

  constructor(
    public userData: UserData,
    public router: Router,
    private authService: AuthService,
    public assetsService: AssetsService
  ) { }

  onLogin(form: NgForm) {
    this.submitted = true;

    if (form.valid) {
      this.tryLogin(this.login);
    }
  }

  tryLogin(value){
    this.authService.doLogin({email: value.username, password: value.password})
    .then(res => {
      this.userData.login(this.login.username);
      this.assetsService.init();
      this.router.navigate(["/app/tabs/problems"]);
    }, err => {
      console.log(err)
    })
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}

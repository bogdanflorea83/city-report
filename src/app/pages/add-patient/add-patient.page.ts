import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {

    validations_form: FormGroup;
    genders: Array<string>;
  
    constructor(
      private router: Router
    ) { }
  
    ngOnInit() {
      //  We just use a few random countries, however, you can use the countries you need by just adding them to this list.
      // also you can use a library to get all the countries from the world.
     
  
      this.genders = [
        "Male",
        "Female"
      ];

    }
  
    validation_messages = {
      'username': [
        { type: 'required', message: 'Username is required.' },
        { type: 'minlength', message: 'Username must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
        { type: 'validUsername', message: 'Your username has already been taken.' }
      ],
      'name': [
        { type: 'required', message: 'Name is required.' }
      ],
      'lastname': [
        { type: 'required', message: 'Last name is required.' }
      ],
      'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'pattern', message: 'Please wnter a valid email.' }
      ],
      'phone': [
        { type: 'required', message: 'Phone is required.' },
        { type: 'validCountryPhone', message: 'The phone is incorrect for the selected country.' }
      ],
      'password': [
        { type: 'required', message: 'Password is required.' },
        { type: 'minlength', message: 'Password must be at least 5 characters long.' },
        { type: 'pattern', message: 'Your password must contain at least one uppercase, one lowercase, and one number.' }
      ],
      'confirm_password': [
        { type: 'required', message: 'Confirm password is required.' }
      ],
      'matching_passwords': [
        { type: 'areEqual', message: 'Password mismatch.' }
      ],
      'terms': [
        { type: 'pattern', message: 'You must accept terms and conditions.' }
      ],
    };
  
    onSubmit(values){
      console.log(values);
      this.router.navigate(["/schedule"]);
    }
  
  }
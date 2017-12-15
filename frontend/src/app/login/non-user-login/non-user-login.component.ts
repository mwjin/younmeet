import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { SignupValidator } from '../signup/signupValidator';

@Component({
  selector: 'app-non-user-login',
  templateUrl: './non-user-login.component.html',
  styleUrls: ['./non-user-login.component.css']
})
export class NonUserLoginComponent implements OnInit {
  signUpForm: FormGroup;
  name: AbstractControl;

  constructor(private accountService: AccountService,
              private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService) {

    this.signUpForm = this.formBuilder.group({
      'name' : [ '', Validators.required ],
    }, {
      validator : SignupValidator.nonUserMatchForm
    });

    this.name = this.signUpForm.controls[ 'name' ];
  }

  ngOnInit() {
  }

  tryLogin() {
    this.accountService.postNonUserSignUp(this.name.value);
    console.log('hello');
  }

  goOut() {
    this.router.navigate([ 'login' ]);
  }
}

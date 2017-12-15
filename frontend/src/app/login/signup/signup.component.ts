import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { SignupValidator } from './signupValidator';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector : 'app-signup',
  templateUrl : './signup.component.html',
  styleUrls : [ './signup.component.css' ]
})


export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  email: AbstractControl;
  username: AbstractControl;  // ID
  password: AbstractControl;
  passwordConfirm: AbstractControl;

  constructor(private accountService: AccountService,
              private router: Router,
              private formBuilder: FormBuilder,
              private authenticationService: AuthenticationService) {
    this.signUpForm = formBuilder.group({
      'email' : [ '', Validators.required ],
      'username' : [ '', Validators.required ],
      'password' : [ '', Validators.required ],
      'passwordConfirm' : [ '', Validators.required ]
    }, {
      validator : SignupValidator.matchForm
    });

    this.email = this.signUpForm.controls[ 'email' ];
    this.username = this.signUpForm.controls[ 'username' ];
    this.password = this.signUpForm.controls[ 'password' ];
    this.passwordConfirm = this.signUpForm.controls[ 'passwordConfirm' ];


  }

  ngOnInit() {
  }

  signUp(): void {
    this.accountService.postUserSignUp(
      this.username.value,
      this.email.value,
      this.password.value
    ).then(isSignUpSuccess => {
      if (isSignUpSuccess) {
        // If success to create a new user
        this.authenticationService.logIn(this.username.value, this.password.value)
          .then(isLogInSuccess => {
            if (isLogInSuccess) {
              this.router.navigate([ 'dashboard' ]);
            } else {
              this.router.navigate([ 'login' ]);
            }
          });
      }
    }).catch(() => {
      document.getElementById('signUpFail').style.display = 'block';
    });
  }
}

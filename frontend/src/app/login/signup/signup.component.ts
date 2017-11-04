import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';
import { SignupValidator } from './signupValidator';

@Component({
  selector : 'app-signup',
  templateUrl : './signup.component.html',
  styleUrls : [ './signup.component.css' ]
})


export class SignupComponent implements OnInit {
  signUpForm: FormGroup;
  private email: AbstractControl;
  private username: AbstractControl;
  private password: AbstractControl;
  private passwordConfirm: AbstractControl;


  constructor(private accoutService: AccountService,
              private router: Router,
              private formBuilder: FormBuilder) {

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
    this.accoutService.postUserSignUp(
      this.username.value,
      this.email.value,
      this.password.value
    ).then(user => {
      if (user) {
        this.router.navigate([ 'login' ]);
      }
    });
  }
}

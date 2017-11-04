import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { Router } from '@angular/router';

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
      'email' : [ '', Validators.compose([
        Validators.required, this.emailValidator
      ]) ],
      'username' : [ '', Validators.compose([
        Validators.required, this.usernameValidator
      ]) ],
      'password' : [ '', Validators.compose([
        Validators.required, this.passwordValidator
      ]) ],
      'passwordConfirm' : [ '', Validators.compose([
        Validators.required, this.passwordConfirmValidator('')
      ]) ]
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
    ).then(response => {
      if (response.status === 201) {
        this.router.navigate([ 'login' ]);
      }
    });
  }

  private emailValidator(control: FormControl): { [s: string]: boolean } {
    const emailReg: RegExp = new RegExp('^[^@\\s]+[@][^@\\s]+[.][a-z]{2,3}$');
    if (!emailReg.test(control.value)) {
      return { invalidEmail : true };
    }
  }

  private usernameValidator(control: FormControl): { [s: string]: boolean } {
    const usernameReg: RegExp = new RegExp('^$');
    if (usernameReg.test(control.value)) {
      return { invalidUsername : true };
    }
    /* TODO:
     * Update username Validator for checking duplicate username
     */
  }

  private passwordValidator(control: FormControl): { [s: string]: boolean } {
    const passwordReg: RegExp = new RegExp('^(?=.*[a-z])(?=.*[0-9])\\S{8,}$');
    if (!passwordReg.test(control.value)) {
      return { invalidPassword : true };
    }
  }

  private passwordConfirmValidator(password: string): ValidatorFn {
    return (control: FormControl): { [s: string]: boolean } => {
      const passwordConfirmReg: RegExp = new RegExp(`^${password}$`);
      if (!passwordConfirmReg.test(control.value)) {
        return { invalidPasswordConfirm : true };
      }
    };
  }
}

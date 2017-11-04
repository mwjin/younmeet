import { AbstractControl } from '@angular/forms';

export class SignupValidator {
  static matchForm(control: AbstractControl) {
    const email = control.get('email').value;
    const username = control.get('username').value;
    const password = control.get('password').value;
    const passwordConfirm = control.get('passwordConfirm').value;

    const emailReg: RegExp = new RegExp('^[^@\\s]+[@][^@\\s]+[.][a-z]{2,3}$');
    if (!emailReg.test(email)) {
      control.get('email').setErrors({ invalidEmail : true });
    }

    const usernameReg: RegExp = new RegExp('^$');
    if (usernameReg.test(username)) {
      control.get('username').setErrors({ invalidUsername : true });
    }
    /* TODO:
     * Update username Validator for checking duplicate username
     */

    const passwordReg: RegExp = new RegExp('^(?=.*[a-z])(?=.*[0-9])\\S{8,}$');
    if (!passwordReg.test(password)) {
      control.get('password').setErrors({ invalidPassword : true });
    }

    if (password !== passwordConfirm) {
      control.get('passwordConfirm').setErrors({ invalidPasswordConfirm : true });
    }
  }
}

import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
  static matchForm(control: AbstractControl) {
    const password = control.get('password').value;
    const passwordConfirm = control.get('passwordConfirm').value;

    const passwordReg: RegExp = new RegExp('^(?=.*[a-z])(?=.*[0-9])\\S{8,}$');
    if (!passwordReg.test(password)) {
      control.get('password').setErrors({ invalidPassword : true });
    }

    if (password !== passwordConfirm) {
      control.get('passwordConfirm').setErrors({ invalidPasswordConfirm : true });
    }
  }
}

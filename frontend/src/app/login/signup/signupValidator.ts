import { AbstractControl } from '@angular/forms';

export class SignupValidator {
  static matchPassword(control: AbstractControl) {
    const password = control.get('password').value;
    const passwordConfirm = control.get('passwordConfirm').value;

    if (password !== passwordConfirm) {
      control.get('passwordConfirm').setErrors({ invalidPasswordConfirm : true });
    }
  }
}

import { AbstractControl } from '@angular/forms';

export class PasswordValidator {
  static matchForm(control: AbstractControl) {
    const newPassword = control.get('newPassword').value;
    const newPasswordConfirm = control.get('newPasswordConfirm').value;

    const passwordReg: RegExp = new RegExp('^(?=.*[a-z])(?=.*[0-9])\\S{8,}$');
    if (!passwordReg.test(newPassword)) {
      control.get('newPassword').setErrors({ invalidPassword : true });
    }

    if (newPassword !== newPasswordConfirm) {
      control.get('newPasswordConfirm').setErrors({ invalidPasswordConfirm : true });
    }
  }
}

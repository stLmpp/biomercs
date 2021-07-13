import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';

interface AuthChangePasswordForm {
  code: string | null;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

@Component({
  selector: 'bio-change-password-confirm',
  templateUrl: './change-password-confirm.component.html',
  styleUrls: ['./change-password-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordConfirmComponent {
  form = new ControlGroup<AuthChangePasswordForm>({
    code: new Control(null, [Validators.required]),
    oldPassword: new Control('', [Validators.required]),
    newPassword: new Control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.sibblingEquals('confirmNewPassword'),
    ]),
    confirmNewPassword: new Control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.sibblingEquals('newPassword'),
    ]),
  });
}

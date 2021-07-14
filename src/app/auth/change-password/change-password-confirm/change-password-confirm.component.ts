import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { LocalState } from '@stlmpp/store';
import { debounceTime } from 'rxjs';

interface AuthChangePasswordForm {
  code: string | null;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface AuthChangePasswordComponentState {
  hideOldPassword: boolean;
  hidePassword: boolean;
  hideConfirmPassword: boolean;
  error: string | null;
}

@Component({
  selector: 'bio-change-password-confirm',
  templateUrl: './change-password-confirm.component.html',
  styleUrls: ['./change-password-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class ChangePasswordConfirmComponent extends LocalState<AuthChangePasswordComponentState> {
  constructor() {
    super({ hideOldPassword: true, hideConfirmPassword: true, hidePassword: true, error: null });
  }

  state$ = this.selectState(['hideOldPassword', 'hideConfirmPassword', 'hidePassword']);
  error$ = this.selectState('error');

  form = new ControlGroup<AuthChangePasswordForm>({
    code: new Control(null, [Validators.required]),
    oldPassword: new Control('', [Validators.required, Validators.siblingNotEquals('confirmNewPassword')]),
    newPassword: new Control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.siblingEquals('confirmNewPassword'),
    ]),
    confirmNewPassword: new Control('', [
      Validators.required,
      Validators.minLength(6),
      Validators.siblingEquals('newPassword'),
      Validators.siblingNotEquals('oldPassword'),
    ]),
  });

  password$ = this.form.get('newPassword').value$.pipe(debounceTime(250));

  toggleHideOldPassword(): void {
    this.updateState('hideOldPassword', hideOldPassword => !hideOldPassword);
  }

  toggleHidePassword(): void {
    this.updateState('hidePassword', hidePassword => !hidePassword);
  }

  toggleHideConfirmPassword(): void {
    this.updateState('hideConfirmPassword', hideConfirmPassword => !hideConfirmPassword);
  }
}

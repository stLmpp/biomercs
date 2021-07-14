import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { LocalState } from '@stlmpp/store';
import { debounceTime, finalize, tap } from 'rxjs';
import { AuthChangePassword } from '@model/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { AuthService } from '../../auth.service';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';

interface AuthChangePasswordForm {
  code: number | null;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

interface AuthChangePasswordComponentState {
  hideOldPassword: boolean;
  hidePassword: boolean;
  hideConfirmPassword: boolean;
  error: string | null;
  confirming: boolean;
}

const initialState: AuthChangePasswordComponentState = {
  hideOldPassword: true,
  hideConfirmPassword: true,
  hidePassword: true,
  error: null,
  confirming: false,
};

@Component({
  selector: 'bio-change-password-confirm',
  templateUrl: './change-password-confirm.component.html',
  styleUrls: ['./change-password-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class ChangePasswordConfirmComponent extends LocalState<AuthChangePasswordComponentState> {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router
  ) {
    super(initialState);
  }

  state$ = this.selectState(['hideOldPassword', 'hideConfirmPassword', 'hidePassword']);
  error$ = this.selectState('error');
  confirming$ = this.selectState('confirming');

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

  onConfirm(): void {
    if (this.form.invalid) {
      return;
    }
    const { newPassword, oldPassword, code } = this.form.value;
    // Safe to use, because there's a guard that validates this param
    const key = this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.key)!;
    this.updateState({ confirming: true });
    this.form.disable();
    const dto: AuthChangePassword = {
      newPassword,
      oldPassword,
      key,
      // Also safe to use, because there's form validation
      confirmationCode: code!,
    };
    this.authService
      .confirmChangePassword(dto)
      .pipe(
        tap(() => {
          this.updateState({ confirming: false, error: null });
          this.snackBarService.open('Password changed successfully!');
          this.router.navigate(['/']).then();
        }),
        catchAndThrow(error => {
          this.updateState({ error: error.message, confirming: false });
        }),
        finalize(() => {
          this.form.enable();
        })
      )
      .subscribe();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { debounceTime, finalize, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { User } from '@model/user';
import { LocalState } from '@stlmpp/store';

interface ForgotPasswordForm {
  email: string;
  code: number | null;
  password: string;
}

interface ForgotPasswordComponentState {
  loading: boolean;
  emailSent: boolean;
  confirmCodeError: null | string;
}

@Component({
  selector: 'bio-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends LocalState<ForgotPasswordComponentState> {
  constructor(private authService: AuthService, private router: Router, private snackBarService: SnackBarService) {
    super({ loading: false, emailSent: false, confirmCodeError: null });
  }

  readonly emailForm = new ControlGroup<ForgotPasswordForm>({
    email: new Control('', [Validators.required, Validators.email]),
    password: new Control(''),
    code: new Control(null),
  });

  readonly state$ = this.selectState(['loading', 'emailSent']);
  readonly confirmCodeError$ = this.selectState('confirmCodeError');
  readonly password$ = this.emailForm.get('password').value$.pipe(debounceTime(300));

  submit(): void {
    this.updateState('loading', true);
    this.emailForm.disable();
    let request$: Observable<void | User>;
    if (this.getState('emailSent')) {
      this.updateState('confirmCodeError', null);
      const { password, code } = this.emailForm.value;
      // Code has to be defined at this point, because of the validations
      request$ = this.authService.changeForgottenPassword(code!, password).pipe(
        tap(() => {
          this.router.navigate(['/']).then();
          this.snackBarService.open('Password changed successfully');
        }),
        catchAndThrow(err => {
          this.updateState('confirmCodeError', err.message);
        })
      );
    } else {
      const { email } = this.emailForm.value;
      request$ = this.authService.forgotPassword(email).pipe(
        tap(() => {
          this.emailForm.get('password').setValidator(Validators.required);
          this.emailForm.get('code').setValidator(Validators.required);
          this.updateState('emailSent', true);
        })
      );
    }
    request$
      .pipe(
        finalize(() => {
          this.updateState('loading', false);
          this.emailForm.enable();
        }),
        catchAndThrow(error => {
          this.snackBarService.open(error.message);
        })
      )
      .subscribe();
  }
}

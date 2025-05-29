import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { debounceTime, finalize, Observable, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { User } from '@model/user';

interface ForgotPasswordForm {
  email: string;
  code: number | null;
  password: string;
}

@Component({
    selector: 'bio-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ForgotPasswordComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackBarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  readonly emailForm = new ControlGroup<ForgotPasswordForm>({
    email: new Control('', [Validators.required, Validators.email]),
    password: new Control(''),
    code: new Control(null),
  });

  readonly password$ = this.emailForm.get('password').value$.pipe(debounceTime(300));
  loading = false;
  emailSent = false;
  confirmCodeError: string | null = null;

  submit(): void {
    this.loading = true;
    this.emailForm.disable();
    let request$: Observable<void | User>;
    if (this.emailSent) {
      this.confirmCodeError = null;
      const { password, code } = this.emailForm.value;
      // Code has to be defined at this point, because of the validations
      request$ = this.authService.changeForgottenPassword(code!, password).pipe(
        tap(() => {
          this.router.navigate(['/']).then();
          this.snackBarService.open('Password changed successfully');
        }),
        catchAndThrow(err => {
          this.confirmCodeError = err.message;
        })
      );
    } else {
      const { email } = this.emailForm.value;
      request$ = this.authService.forgotPassword(email).pipe(
        tap(() => {
          this.emailForm.get('password').setValidator(Validators.required);
          this.emailForm.get('code').setValidator(Validators.required);
          this.emailSent = true;
        })
      );
    }
    request$
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
          this.emailForm.enable();
        }),
        catchAndThrow(error => {
          this.snackBarService.open(error.message);
        })
      )
      .subscribe();
  }
}

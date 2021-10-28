import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
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

@Component({
  selector: 'bio-change-password-confirm',
  templateUrl: './change-password-confirm.component.html',
  styleUrls: ['./change-password-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class ChangePasswordConfirmComponent {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  hideOldPassword = true;
  hideConfirmPassword = true;
  hidePassword = true;
  error: string | null = null;
  confirming = false;

  readonly form = new ControlGroup<AuthChangePasswordForm>({
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

  readonly password$ = this.form.get('newPassword').value$.pipe(debounceTime(250));

  onConfirm(): void {
    if (this.form.invalid) {
      return;
    }
    const { newPassword, oldPassword, code } = this.form.value;
    // Safe to use, because there's a guard that validates this param
    const key = this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.key)!;
    this.confirming = true;
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
          this.error = null;
          this.snackBarService.open('Password changed successfully!');
          this.router.navigate(['/']).then();
        }),
        catchAndThrow(error => {
          this.error = error.message;
        }),
        finalize(() => {
          this.confirming = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        })
      )
      .subscribe();
  }
}

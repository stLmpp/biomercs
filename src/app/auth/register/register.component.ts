import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, finalize, tap } from 'rxjs/operators';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { EmailExistsValidator } from '@shared/validators/email-exists.validator';
import { UsernameExistsValidator } from '@shared/validators/username-exists.validator';
import { StateComponent } from '@shared/components/common/state-component';
import { AuthRegister, AuthRegisterVW } from '@model/auth';
import { User } from '@model/user';

interface AuthRegisterForm extends AuthRegister {
  confirmPassword: string;
  code: number | null;
}

@Component({
  selector: 'bio-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends StateComponent<{
  loadingSteam: boolean;
  loading: boolean;
  emailSent: boolean;
  errorConfirmationCode: string | null;
}> {
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private controlBuilder: ControlBuilder,
    private router: Router,
    private emailExistsValidator: EmailExistsValidator,
    private usernameExistsValidator: UsernameExistsValidator
  ) {
    super({ loading: false, errorConfirmationCode: null, emailSent: false, loadingSteam: false });
  }

  private _idUser = 0;

  loading$ = this.selectStateMulti(['loading', 'loadingSteam']);

  hidePassword = true;
  hideConfirmPassword = true;
  emailSent$ = this.selectState('emailSent');
  errorConfirmationCode$ = this.selectState('errorConfirmationCode');

  form = this.controlBuilder.group<AuthRegisterForm>({
    username: ['', [Validators.required, Validators.minLength(3), this.usernameExistsValidator]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.sibblingEquals('confirmPassword')]],
    email: ['', [Validators.required, Validators.email, this.emailExistsValidator]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.sibblingEquals('password')]],
    code: [null],
  });

  password$ = this.form.get('password').value$.pipe(debounceTime(300));

  registerSteam(): void {
    this.updateState('loadingSteam', true);
    this.authService
      .loginSteam(['../', 'steam'], this.activatedRoute, this.destroy$, true, this.form.get('email').value)
      .pipe(
        finalize(() => {
          this.updateState('loadingSteam', false);
        })
      )
      .subscribe();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.updateState('loading', true);
    this.form.disable();
    let request$: Observable<AuthRegisterVW | User>;
    if (this.getState('emailSent')) {
      this.updateState('errorConfirmationCode', null);
      // Can't be here if code is null or undefined
      request$ = this.authService.confirmCode(this._idUser, this.form.get('code').value!).pipe(
        tap(() => {
          this.router.navigate(['/']).then();
        }),
        catchAndThrow(err => {
          this.updateState('errorConfirmationCode', err.message);
        })
      );
    } else {
      const { email, password, username } = this.form.value;
      request$ = this.authService.register({ email, password, username }).pipe(
        tap(response => {
          this._idUser = response.idUser;
          this.updateState('emailSent', true);
          this.form.get('code').setValidator(Validators.required);
        })
      );
    }
    request$
      .pipe(
        finalize(() => {
          this.updateState('loading', false);
          this.form.enable();
        })
      )
      .subscribe();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { debounceTime, finalize, Observable, pluck, tap } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ControlBuilder,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { EmailExistsValidator } from '@shared/validators/email-exists.validator';
import { UsernameExistsValidator } from '@shared/validators/username-exists.validator';
import { AuthRegister, AuthRegisterVW } from '@model/auth';
import { User } from '@model/user';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { ConfirmationCodeInputComponent } from '../shared/confirmation-code-input/confirmation-code-input.component';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { InputDirective } from '../../shared/components/form/input.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { FormFieldHintDirective } from '../../shared/components/form/hint.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SuffixDirective } from '../../shared/components/common/suffix.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PasswordStrongComponent } from '../shared/password-strong/password-strong.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';
import { AsyncPipe } from '@angular/common';

interface AuthRegisterForm extends AuthRegister {
  confirmPassword: string;
  code: number | null;
}

@Component({
  selector: 'bio-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlModule,
    StControlCommonModule,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    ConfirmationCodeInputComponent,
    FormFieldComponent,
    InputDirective,
    StControlValueModule,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    FormFieldHintDirective,
    ButtonComponent,
    SuffixDirective,
    IconComponent,
    PasswordStrongComponent,
    CardActionsDirective,
    AsyncPipe,
  ],
})
export class RegisterComponent extends Destroyable {
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private controlBuilder: ControlBuilder,
    private router: Router,
    private emailExistsValidator: EmailExistsValidator,
    private usernameExistsValidator: UsernameExistsValidator,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

  private _idUser = 0;

  loading = false;
  loadingSteam = false;
  emailSent = false;
  errorConfirmationCode: string | null = null;

  readonly form = this.controlBuilder.group<AuthRegisterForm>({
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.usernameExistsValidator],
    ],
    password: ['', [Validators.required, Validators.minLength(6), Validators.siblingEquals('confirmPassword')]],
    email: ['', [Validators.required, Validators.email, this.emailExistsValidator]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6), Validators.siblingEquals('password')]],
    code: [null],
  });
  readonly password$ = this.form.get('password').value$.pipe(debounceTime(300));

  readonly usernameControl = this.form.get('username');
  readonly usernameLength$ = this.usernameControl.value$.pipe(pluck('length'));
  readonly emailControl = this.form.get('email');

  hidePassword = true;
  hideConfirmPassword = true;

  registerSteam(): void {
    this.loadingSteam = true;
    this.authService
      .loginSteam(['../', 'steam'], this.activatedRoute, this.destroy$, true, this.form.get('email').value)
      .pipe(
        finalize(() => {
          this.loadingSteam = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.form.disable();
    let request$: Observable<AuthRegisterVW | User>;
    if (this.emailSent) {
      this.errorConfirmationCode = null;
      // Can't be here if code is null or undefined
      request$ = this.authService.confirmCode(this._idUser, this.form.get('code').value!).pipe(
        tap(() => {
          this.authService.showRegistrationCompletedModal().then();
        }),
        catchAndThrow(err => {
          this.errorConfirmationCode = err.message;
          this.changeDetectorRef.markForCheck();
        })
      );
    } else {
      const { email, password, username } = this.form.value;
      request$ = this.authService.register({ email, password, username }).pipe(
        tap(response => {
          this._idUser = response.idUser;
          this.emailSent = true;
          this.changeDetectorRef.markForCheck();
          this.form.get('code').setValidator(Validators.required);
        })
      );
    }
    request$
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        })
      )
      .subscribe();
  }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import {
  ControlBuilder,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { finalize, Observable, tap } from 'rxjs';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { User } from '@model/user';
import { AuthRegisterVW, AuthSteamValidateNames } from '@model/auth';
import { EmailExistsValidator } from '@shared/validators/email-exists.validator';
import { SteamRegisterNameExistsValidator } from '@shared/validators/steam-register-name-exists.validator';
import { CardComponent } from '../../../shared/components/card/card.component';
import { CardTitleDirective } from '../../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../../shared/components/card/card-content.directive';
import { ConfirmationCodeInputComponent } from '../../shared/confirmation-code-input/confirmation-code-input.component';
import { FormFieldComponent } from '../../../shared/components/form/form-field.component';
import { InputDirective } from '../../../shared/components/form/input.directive';
import { FormFieldErrorsDirective } from '../../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../../shared/components/form/error.component';
import { CardActionsDirective } from '../../../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../../../shared/components/button/button.component';

interface SteamRegisterForm {
  code: number | null;
  email: string;
  newName: string | undefined;
}

@Component({
  selector: 'bio-steam-register',
  templateUrl: './steam-register.component.html',
  styleUrls: ['./steam-register.component.scss'],
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
    CardActionsDirective,
    ButtonComponent,
  ],
})
export class SteamRegisterComponent implements OnDestroy, OnInit {
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private controlBuilder: ControlBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private emailExistsValidator: EmailExistsValidator,
    private steamRegisterNameExistsValidator: SteamRegisterNameExistsValidator
  ) {}

  get steamid(): string {
    // This component is only accessible when there's a steamid in the route
    return this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.steamid)!;
  }

  get token(): [string, number?] {
    // This component has a guard for this token
    return this.authService.getSteamToken(this.steamid)!;
  }

  readonly form = this.controlBuilder.group<SteamRegisterForm>({
    code: [null],
    email: ['', [Validators.required, Validators.email, this.emailExistsValidator]],
    newName: [''],
  });

  readonly newNameControl = this.form.get('newName');

  readonly emailControl = this.form.get('email');

  readonly authSteamValidateNames: AuthSteamValidateNames = this.activatedRoute.snapshot.data[
    RouteDataEnum.steamValidateNames
  ] ?? { newName: false, steamPersonaName: '' };

  emailSent = false;
  loading = false;

  confirmCodeError: string | null = null;
  idUser = 0;

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading = true;
    this.form.disable();
    let request$: Observable<User | AuthRegisterVW>;
    if (this.emailSent) {
      this.confirmCodeError = null;
      const { code } = this.form.value;
      // Code should be set here because of validations
      request$ = this.authService.confirmCode(this.idUser, code!).pipe(
        tap(() => {
          this.authService.showRegistrationCompletedModal().then();
        }),
        catchAndThrow(err => {
          this.confirmCodeError = err.message;
        })
      );
    } else {
      const { email, newName } = this.form.value;
      const [token] = this.token;
      request$ = this.authService.registerSteam(this.steamid, email, token, newName).pipe(
        tap(({ idUser }) => {
          this.emailSent = true;
          this.form.get('code').setValidator(Validators.required);
          this.idUser = idUser;
        })
      );
    }
    request$
      .pipe(
        finalize(() => {
          this.form.enable();
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data[RouteDataEnum.confirm]) {
      this.emailSent = true;
      this.form.get('code').setValidator(Validators.required);
      const emailControl = this.form.get('email');
      emailControl.removeValidators(emailControl.validators);
      const [, idUser] = this.token;
      this.idUser = idUser!;
    } else {
      if (this.authSteamValidateNames.newName) {
        this.form
          .get('newName')
          .setValidators([Validators.required, this.steamRegisterNameExistsValidator, Validators.maxLength(100)]);
      }
    }
    if (this.activatedRoute.snapshot.queryParamMap.has(RouteParamEnum.email)) {
      // Well, just did the validation up here, sooooo
      this.form.get('email').setValue(this.activatedRoute.snapshot.queryParamMap.get(RouteParamEnum.email)!);
    }
  }

  ngOnDestroy(): void {
    const steamid = this.steamid;
    if (steamid) {
      this.authService.removeSteamToken(steamid);
    }
  }
}

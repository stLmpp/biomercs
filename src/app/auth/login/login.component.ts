import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import {
  Control,
  ControlGroup,
  Validators,
  StControlModule,
  StControlCommonModule,
  StControlValueModule,
} from '@stlmpp/control';
import { AuthService } from '../auth.service';
import { WINDOW } from '../../core/window.service';
import { finalize, map, takeUntil } from 'rxjs';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ModalService } from '@shared/components/modal/modal.service';
import type { LoginConfirmCodeModalComponent } from './login-confirm-code-modal/login-confirm-code-modal.component';
import { HttpError } from '@model/http-error';
import { HttpStatusCode } from '@angular/common/http';
import { AuthCredentials } from '@model/auth';
import { filterNil } from '@util/operators/filter';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { CardComponent } from '../../shared/components/card/card.component';
import { CardTitleDirective } from '../../shared/components/card/card-title.directive';
import { CardContentDirective } from '../../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../../shared/components/form/form-field.component';
import { LabelDirective } from '../../shared/components/form/label.directive';
import { InputDirective } from '../../shared/components/form/input.directive';
import { FormFieldErrorsDirective } from '../../shared/components/form/errors.directive';
import { FormFieldErrorComponent } from '../../shared/components/form/error.component';
import { FormFieldHintDirective } from '../../shared/components/form/hint.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { SuffixDirective } from '../../shared/components/common/suffix.directive';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { CheckboxComponent } from '../../shared/components/checkbox/checkbox.component';
import { CardActionsDirective } from '../../shared/components/card/card-actions.directive';

@Component({
  selector: 'bio-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    StControlModule,
    StControlCommonModule,
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    FormFieldComponent,
    LabelDirective,
    InputDirective,
    StControlValueModule,
    FormFieldErrorsDirective,
    FormFieldErrorComponent,
    FormFieldHintDirective,
    RouterLink,
    ButtonComponent,
    SuffixDirective,
    IconComponent,
    CheckboxComponent,
    CardActionsDirective,
  ],
})
export class LoginComponent extends Destroyable implements OnInit {
  private authService = inject(AuthService);
  private window = inject<Window>(WINDOW);
  private dialogService = inject(DialogService);
  private router = inject(Router);
  private snackBarService = inject(SnackBarService);
  private activatedRoute = inject(ActivatedRoute);
  private modalService = inject(ModalService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  loading = false;
  loadingSteam = false;
  error: string | null = null;

  readonly form = new ControlGroup<AuthCredentials>({
    rememberMe: new Control(true),
    password: new Control('', [Validators.required]),
    username: new Control('', [Validators.required]),
  });

  typePassword = 'password';

  loginSteam(): void {
    this.loadingSteam = true;
    this.authService
      .loginSteam(['../', 'steam'], this.activatedRoute, this.destroy$)
      .pipe(
        finalize(() => {
          this.loadingSteam = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe();
  }

  login(): void {
    this.loading = true;
    const credentials = this.form.value;
    this.form.disable();
    this.authService
      .login(credentials)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
          this.form.enable();
        }),
        catchAndThrow(async (error: HttpError<number>) => {
          this.error = error.message;
          if (error.status === HttpStatusCode.PreconditionFailed) {
            await this.modalService.openLazy<LoginConfirmCodeModalComponent, number>(
              () =>
                import('./login-confirm-code-modal/login-confirm-code-modal.component').then(
                  c => c.LoginConfirmCodeModalComponent
                ),
              {
                data: error.extra,
              }
            );
          }
        })
      )
      .subscribe(() => {
        this.router.navigate(['/']).then();
        this.snackBarService.open('Login successful!');
      });
  }

  ngOnInit(): void {
    this.form.value$
      .pipe(
        map(() => this.error),
        takeUntil(this.destroy$),
        filterNil()
      )
      .subscribe(() => {
        this.error = null;
        this.changeDetectorRef.markForCheck();
      });
  }
}

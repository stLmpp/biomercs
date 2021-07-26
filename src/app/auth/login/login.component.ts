import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { AuthService } from '../auth.service';
import { WINDOW } from '../../core/window.service';
import { filter, finalize, takeUntil, withLatestFrom } from 'rxjs';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ModalService } from '@shared/components/modal/modal.service';
import type { LoginConfirmCodeModalComponent } from './login-confirm-code-modal/login-confirm-code-modal.component';
import { HttpError } from '@model/http-error';
import { HttpStatusCode } from '@angular/common/http';
import { AuthCredentials } from '@model/auth';
import { LocalState } from '@stlmpp/store';

@Component({
  selector: 'bio-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent
  extends LocalState<{ loadingSteam: boolean; loading: boolean; error: string | null }>
  implements OnInit
{
  constructor(
    private authService: AuthService,
    @Inject(WINDOW) private window: Window,
    private dialogService: DialogService,
    private router: Router,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {
    super({ error: null, loading: false, loadingSteam: false });
  }

  readonly loading$ = this.selectState(['loading', 'loadingSteam']);
  readonly error$ = this.selectState('error');
  readonly form = new ControlGroup<AuthCredentials>({
    rememberMe: new Control(true),
    password: new Control('', [Validators.required]),
    username: new Control('', [Validators.required]),
  });

  typePassword = 'password';

  loginSteam(): void {
    this.updateState('loadingSteam', true);
    this.authService
      .loginSteam(['../', 'steam'], this.activatedRoute, this.destroy$)
      .pipe(
        finalize(() => {
          this.updateState('loadingSteam', false);
        })
      )
      .subscribe();
  }

  login(): void {
    this.updateState('loading', true);
    const credentials = this.form.value;
    this.form.disable();
    this.authService
      .login(credentials)
      .pipe(
        finalize(() => {
          this.updateState('loading', false);
          this.form.enable();
        }),
        catchAndThrow(async (error: HttpError<number>) => {
          this.updateState('error', error.message);
          if (error.status === HttpStatusCode.PreconditionFailed) {
            await this.modalService.openLazy<LoginConfirmCodeModalComponent, number>(
              () =>
                import('./login-confirm-code-modal/login-confirm-code-modal.component').then(
                  c => c.LoginConfirmCodeModalComponent
                ),
              {
                data: error.extra,
                disableClose: true,
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
        withLatestFrom(this.error$),
        takeUntil(this.destroy$),
        filter(([_, error]) => !!error)
      )
      .subscribe(() => {
        this.updateState('error', null);
      });
  }
}

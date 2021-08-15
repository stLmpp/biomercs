import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Control, ControlGroup, Validators } from '@stlmpp/control';
import { AuthService } from '../auth.service';
import { WINDOW } from '../../core/window.service';
import { finalize, map, takeUntil } from 'rxjs';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ModalService } from '@shared/components/modal/modal.service';
import type { LoginConfirmCodeModalComponent } from './login-confirm-code-modal/login-confirm-code-modal.component';
import { HttpError } from '@model/http-error';
import { HttpStatusCode } from '@angular/common/http';
import { AuthCredentials } from '@model/auth';
import { filterNil } from '@util/operators/filter';
import { Destroyable } from '@shared/components/common/destroyable-component';

@Component({
  selector: 'bio-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends Destroyable implements OnInit {
  constructor(
    private authService: AuthService,
    @Inject(WINDOW) private window: Window,
    private dialogService: DialogService,
    private router: Router,
    private snackBarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
  }

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

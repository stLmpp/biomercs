import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { RouterQuery } from '@stlmpp/router';
import { ControlBuilder, Validators } from '@stlmpp/control';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { User } from '@model/user';
import { AuthRegisterVW } from '@model/auth';
import { LocalState } from '@stlmpp/store';

interface SteamRegisterForm {
  code: number | null;
  email: string;
}

@Component({
  selector: 'bio-steam-register',
  templateUrl: './steam-register.component.html',
  styleUrls: ['./steam-register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SteamRegisterComponent
  extends LocalState<{
    loading: boolean;
    emailSent: boolean;
    confirmCodeError: string | null;
  }>
  implements OnDestroy, OnInit
{
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private routerQuery: RouterQuery,
    private controlBuilder: ControlBuilder,
    private router: Router
  ) {
    super({ emailSent: false, loading: false, confirmCodeError: null });
  }

  get steamid(): string {
    // This component is only accessible when there's a steamid in the route
    return this.activatedRoute.snapshot.paramMap.get(RouteParamEnum.steamid)!;
  }

  get token(): [string, number?] {
    // This component has a guard for this token
    return this.authService.getSteamToken(this.steamid)!;
  }

  form = this.controlBuilder.group<SteamRegisterForm>({
    code: [null],
    email: ['', [Validators.required, Validators.email]],
  });

  state$ = this.selectState(['emailSent', 'loading']);

  confirmCodeError$ = this.selectState('confirmCodeError');

  idUser = 0;

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.updateState('loading', true);
    this.form.disable();
    let request$: Observable<User | AuthRegisterVW>;
    if (this.getState('emailSent')) {
      this.updateState('confirmCodeError', null);
      const { code } = this.form.value;
      // Code should be set here because of validations
      request$ = this.authService.confirmCode(this.idUser, code!).pipe(
        tap(() => {
          this.router.navigate(['/']).then();
        }),
        catchAndThrow(err => {
          this.updateState('confirmCodeError', err.message);
        })
      );
    } else {
      const { email } = this.form.value;
      const [token] = this.token;
      request$ = this.authService.registerSteam(this.steamid, email, token).pipe(
        tap(({ idUser }) => {
          this.updateState('emailSent', true);
          this.form.get('code').setValidator(Validators.required);
          this.idUser = idUser;
        })
      );
    }
    request$
      .pipe(
        finalize(() => {
          this.form.enable();
          this.updateState('loading', false);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.data[RouteDataEnum.confirm]) {
      this.updateState('emailSent', true);
      this.form.get('code').setValidator(Validators.required);
      const emailControl = this.form.get('email');
      emailControl.removeValidators(emailControl.validators);
      const [, idUser] = this.token;
      this.idUser = idUser!;
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
    super.ngOnDestroy();
  }
}

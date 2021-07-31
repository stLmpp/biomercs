import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize, Observable, of, switchMap, switchMapTo, takeUntil, tap, timeout } from 'rxjs';
import { AuthStore } from './auth.store';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { ignoreErrorContext } from './auth-error.interceptor';
import { HttpParams } from '@util/http-params';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { WINDOW } from '../core/window.service';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { v4 } from 'uuid';
import {
  AuthChangePassword,
  AuthCredentials,
  AuthGatewayEvents,
  AuthRegister,
  AuthRegisterVW,
  AuthSteamLoginSocketVW,
} from '@model/auth';
import { User } from '@model/user';
import { AuthSteamLoginSocketErrorType } from '@model/enum/auth-steam-login-socket-error-type';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';
import { DialogDataButtonType } from '@shared/components/modal/dialog/dialog-data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private authStore: AuthStore,
    private dialogService: DialogService,
    @Inject(WINDOW) private window: Window,
    private snackBarService: SnackBarService,
    private router: Router,
    private socketIOService: SocketIOService
  ) {}

  private readonly _steamidAuthMap = new Map<string, [string, number?]>();
  private readonly _socketConnection = this.socketIOService.createConnection('auth');

  readonly endPoint = 'auth';

  private _getSteamLoginUrl(uuid: string): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<string>(`${this.endPoint}/steam/login/${uuid}`, undefined, {
      responseType: 'text' as any,
      headers,
    });
  }

  register(dto: AuthRegister): Observable<AuthRegisterVW> {
    return this.http.post<AuthRegisterVW>(`${this.endPoint}/register`, dto, {
      context: ignoreErrorContext(),
    });
  }

  login(dto: AuthCredentials): Observable<User> {
    return this.http.post<User>(`${this.endPoint}/login`, dto, { context: ignoreErrorContext() }).pipe(
      tap(user => {
        this.authStore.updateState({ user });
      })
    );
  }

  autoLogin(): Observable<User | null> {
    const autoLogin$ = this.http.post<User>(`${this.endPoint}/auto-login`, undefined, {
      context: ignoreErrorContext(),
    });
    return this.authStore.waitForPersistedValue().pipe(
      switchMapTo(autoLogin$),
      tap(userLogged => {
        this.authStore.updateState({ user: userLogged });
      }),
      catchAndThrow(() => {
        this.authStore.updateState({ user: null });
        this.router.navigate(['/auth/login']).then();
      })
    );
  }

  resendCode(idUser: number): Observable<void> {
    return this.http.post<void>(`${this.endPoint}/user/${idUser}/resend-code`, undefined);
  }

  confirmCode(idUser: number, code: number): Observable<User> {
    return this.http.post<User>(`${this.endPoint}/user/${idUser}/confirm-code/${code}`, undefined).pipe(
      tap(user => {
        this.authStore.updateState({ user });
      })
    );
  }

  async showRegistrationCompletedModal(): Promise<void> {
    this.router.navigate(['/']).then();
    await this.dialogService.success({
      title: 'Welcome to the family, son',
      content: 'What now?',
      buttons: [
        {
          title: 'Close',
          action: modalRef => {
            modalRef.close();
            this.router.navigate(['/']).then();
          },
        },
        {
          title: 'Submit your first score',
          action: modalRef => {
            modalRef.close();
            this.router.navigate(['/score/add']).then();
          },
        },
      ],
    });
  }

  loginSteam(
    steamAuthRelativePath: string[],
    relativeTo: ActivatedRoute,
    destroy$: Observable<any>,
    skipConfirmCreate?: boolean,
    email?: string | null
  ): Observable<boolean | User | null> {
    const uuid = v4();
    return this._getSteamLoginUrl(uuid).pipe(
      switchMap(url => {
        const windowSteam = this.window.open(url, 'Login Steam', 'width=500,height=500');
        return this.loginSteamSocket(uuid).pipe(
          takeUntil(destroy$),
          timeout(5 * 60 * 1000), // Timeout after 5 minutes
          switchMap(({ token, error, steamid, errorType, idUser }) => {
            let request$: Observable<boolean | User | null>;
            if (error) {
              windowSteam?.close();
              let content = 'Want to create an account?';
              let btnYes: string | null = 'Create account';
              if (errorType === AuthSteamLoginSocketErrorType.userNotConfirmed) {
                content = 'Want to confirm it?';
                btnYes = 'Confirm';
              }
              if (
                errorType === AuthSteamLoginSocketErrorType.unknown ||
                errorType === AuthSteamLoginSocketErrorType.userBanned
              ) {
                content = '';
                btnYes = null;
              }
              if (errorType === AuthSteamLoginSocketErrorType.userLocked) {
                content = '';
                btnYes = null;
              }
              if (skipConfirmCreate && errorType === AuthSteamLoginSocketErrorType.userNotFound) {
                request$ = of(true);
              } else {
                const buttons: DialogDataButtonType[] = ['Close'];
                if (btnYes) {
                  buttons.push({ title: btnYes, action: bsModalRef => bsModalRef.close(true) });
                }
                request$ = this.dialogService.confirm({
                  title: error,
                  content,
                  buttons,
                });
              }
              request$ = request$.pipe(
                tap(result => {
                  if (result) {
                    if (steamid && token) {
                      this.addSteamToken(steamid, token, idUser);
                    }
                    let path = 'register';
                    if (errorType === AuthSteamLoginSocketErrorType.userNotConfirmed) {
                      path = 'confirm';
                    }
                    const queryParams: Params = {};
                    if (errorType === AuthSteamLoginSocketErrorType.userNotFound && email) {
                      queryParams.email = email;
                    }
                    this.router.navigate([...steamAuthRelativePath, steamid, path], { relativeTo, queryParams }).then();
                  } else {
                    this.router.navigate(['/']).then();
                  }
                })
              );
            } else {
              request$ = this.updateToken(token).pipe(
                tap(() => {
                  this.router.navigate(['/']).then();
                  this.snackBarService.open('Login successful!');
                })
              );
            }
            return request$.pipe(
              finalize(() => {
                windowSteam?.close();
              })
            );
          }),
          catchAndThrow(err => {
            if (err.name === 'TimeoutError') {
              this.snackBarService.open('Login timeout');
            } else {
              this.snackBarService.open(err.message);
            }
          })
        );
      })
    );
  }

  loginSteamSocket(uuid: string): Observable<AuthSteamLoginSocketVW> {
    return this._socketConnection.fromEventOnce<AuthSteamLoginSocketVW>(AuthGatewayEvents.loginSteam + uuid);
  }

  updateToken(token: string): Observable<User | null> {
    this.authStore.updateState(state => ({ ...state, user: { token } as any }));
    return this.autoLogin();
  }

  logout(): void {
    this.authStore.updateState({ user: null });
  }

  forgotPassword(email: string): Observable<void> {
    const params = new HttpParams({ email });
    return this.http.post<void>(`${this.endPoint}/forgot-password`, undefined, {
      params,
      context: ignoreErrorContext(),
    });
  }

  changeForgottenPassword(confirmationCode: number, password: string): Observable<User> {
    return this.http
      .post<User>(`${this.endPoint}/forgot-password/change-password`, { confirmationCode, password })
      .pipe(
        tap(user => {
          this.authStore.updateState({ user });
        })
      );
  }

  registerSteam(steamid: string, email: string, token: string): Observable<AuthRegisterVW> {
    const headers = new HttpHeaders({ 'authorization-steam': token });
    return this.http.post<AuthRegisterVW>(`${this.endPoint}/steam/register`, { email, steamid }, { headers });
  }

  validateTokenRegisterSteam(steamid: string, token: string): Observable<boolean> {
    const headers = new HttpHeaders({ 'authorization-steam': token });
    return this.http.post<boolean>(`${this.endPoint}/steam/${steamid}/validate-token`, undefined, { headers });
  }

  addSteamToken(steamid: string, token: string, idUser?: number): void {
    this._steamidAuthMap.set(steamid, [token, idUser]);
  }

  removeSteamToken(steamid: string): void {
    this._steamidAuthMap.delete(steamid);
  }

  getSteamToken(steamid: string): [string, number?] | undefined {
    return this._steamidAuthMap.get(steamid);
  }

  usernameExists(username: string): Observable<boolean> {
    const params = new HttpParams({ username });
    return this.http.get<boolean>(`${this.endPoint}/user/exists`, { params });
  }

  emailExists(email: string): Observable<boolean> {
    const params = new HttpParams({ email });
    return this.http.get<boolean>(`${this.endPoint}/user/exists`, { params });
  }

  sendChangePasswordConfirmationCode(): Observable<void> {
    return this.http.post<void>(`${this.endPoint}/change-password`, undefined);
  }

  confirmChangePassword(dto: AuthChangePassword): Observable<User> {
    return this.http.post<User>(`${this.endPoint}/change-password/confirm`, dto).pipe(
      tap(user => {
        this.authStore.updateState({ user });
      })
    );
  }

  changePasswordValidate(key: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.endPoint}/change-password/validate/${key}`);
  }
}

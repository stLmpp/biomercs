import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { finalize, switchMap, takeUntil, tap, timeout } from 'rxjs/operators';
import { AuthStore } from './auth.store';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { AuthErrorInterceptor } from './auth-error.interceptor';
import { HttpParams } from '@util/http-params';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { WINDOW } from '../core/window.service';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { v4 } from 'uuid';
import { AuthCredentials, AuthGatewayEvents, AuthRegister, AuthRegisterVW, AuthSteamLoginSocketVW } from '@model/auth';
import { User } from '@model/user';
import { AuthSteamLoginSocketErrorType } from '@model/enum/auth-steam-login-socket-error-type';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';

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

  private _steamidAuthMap = new Map<string, [string, number?]>();
  private _socketConnection = this.socketIOService.createConnection('auth');

  endPoint = 'auth';

  private _getSteamLoginUrl(uuid: string): Observable<string> {
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.post<string>(`${this.endPoint}/steam/login/${uuid}`, undefined, {
      responseType: 'text',
      headers,
    } as any) as any;
  }

  register(dto: AuthRegister): Observable<AuthRegisterVW> {
    return this.http.post<AuthRegisterVW>(`${this.endPoint}/register`, dto, {
      headers: AuthErrorInterceptor.ignoreHeaders,
    });
  }

  login(dto: AuthCredentials): Observable<User> {
    return this.http
      .post<User>(`${this.endPoint}/login`, dto, { headers: AuthErrorInterceptor.ignoreHeaders })
      .pipe(
        tap(user => {
          this.authStore.updateState({ user });
        })
      );
  }

  autoLogin(): Observable<User> {
    return this.http
      .post<User>(`${this.endPoint}/auto-login`, undefined, { headers: AuthErrorInterceptor.ignoreHeaders })
      .pipe(
        tap(user => {
          this.authStore.updateState({ user });
        }),
        catchAndThrow(() => {
          this.authStore.updateState({ user: null });
          return of(null);
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

  loginSteam(
    steamAuthRelativePath: string[],
    relativeTo: ActivatedRoute,
    destroy$: Observable<any>,
    skipConfirmCreate?: boolean,
    email?: string | null
  ): Observable<boolean | User> {
    const uuid = v4();
    return this._getSteamLoginUrl(uuid).pipe(
      switchMap(url => {
        const windowSteam = this.window.open(url, 'Login Steam', 'width=500,height=500');
        return this.loginSteamSocket(uuid).pipe(
          takeUntil(destroy$),
          timeout(5 * 60 * 1000), // Timeout after 5 minutes
          switchMap(({ token, error, steamid, errorType, idUser }) => {
            let request$: Observable<boolean | User>;
            if (error) {
              windowSteam?.close();
              let content = 'Want to create an account?';
              let btnYes = 'Create account';
              if (errorType === AuthSteamLoginSocketErrorType.userNotConfirmed) {
                content = 'Want to confirm it?';
                btnYes = 'Confirm';
              }
              if (skipConfirmCreate && errorType === AuthSteamLoginSocketErrorType.userNotFound) {
                request$ = of(true);
              } else {
                request$ = this.dialogService.confirm({
                  title: error,
                  content,
                  btnYes,
                  btnNo: 'Close',
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

  updateToken(token: string): Observable<User> {
    this.authStore.updateState(state => ({ ...state, user: { token } as any }));
    return this.autoLogin();
  }

  logout(): void {
    this.authStore.updateState({ user: null });
  }

  forgotPassword(email: string): Observable<void> {
    const params = new HttpParams({ email });
    return this.http.post<void>(`${this.endPoint}/forgot-password`, undefined, { params });
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
}

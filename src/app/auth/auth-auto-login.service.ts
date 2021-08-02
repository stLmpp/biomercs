import { Injectable } from '@angular/core';
import { Observable, switchMapTo, tap } from 'rxjs';
import { User } from '@model/user';
import { ignoreErrorContext } from './auth-error.interceptor';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthAutoLoginService {
  constructor(private http: HttpClient, private authStore: AuthStore, private router: Router) {}

  readonly endPoint = 'auth';

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
}

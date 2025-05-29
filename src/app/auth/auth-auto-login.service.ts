import { Injectable, inject } from '@angular/core';
import { first, Observable, of, switchMapTo, tap } from 'rxjs';
import { User } from '@model/user';
import { ignoreErrorContext } from './auth-error.interceptor';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class AuthAutoLoginService {
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);


  readonly endPoint = 'auth';

  autoLogin(): Observable<User | null> {
    const autoLogin$ = this.http.post<User>(`${this.endPoint}/auto-login`, undefined, {
      context: ignoreErrorContext(),
    });
    return this.authStore.waitForPersistedValue().pipe(
      first(),
      switchMapTo(autoLogin$),
      tap(userLogged => {
        this.authStore.updateState({ user: userLogged });
      }),
      catchAndThrow(() => {
        this.authStore.updateState({ user: null });
        return of(null);
      })
    );
  }
}

import { Injectable, inject } from '@angular/core';
import { Query } from '@stlmpp/store';
import { AuthStore } from './auth.store';
import { Auth } from '@model/auth';
import { distinctUntilChanged, map, Observable, pluck } from 'rxjs';
import { Player } from '@model/player';
import { User } from '@model/user';
import { isNumber } from 'st-utils';
import { filterNil } from '@util/operators/filter';

@Injectable({ providedIn: 'root' })
export class AuthQuery extends Query<Auth> {
  private authStore: AuthStore;

  constructor() {
    const authStore = inject(AuthStore);

    super(authStore);

    this.authStore = authStore;
  }

  readonly isLogged$ = this.select('user').pipe(
    map(user => !!user?.id && !!user.token),
    distinctUntilChanged()
  );
  readonly user$ = this.select('user');
  readonly isAdmin$ = this.user$.pipe(
    filterNil(),
    map(user => user.admin),
    distinctUntilChanged()
  );
  readonly token$ = this.user$.pipe(map(user => user?.token));
  readonly idUser$ = this.user$.pipe(filterNil(), pluck('id'));

  getToken(): string {
    return this.getUser()?.token ?? '';
  }

  getIsAdmin(): boolean {
    return !!this.getUser()?.admin;
  }

  getUser(): User | null {
    return this.getState().user;
  }

  getIsLogged(): boolean {
    const user = this.getUser();
    return !!user?.id && !!user.token;
  }

  selectIsSameAsLogged(value: number | Player): Observable<boolean> {
    const idPlayer = isNumber(value) ? value : value.id;
    return this.user$.pipe(map(user => user?.idPlayer === idPlayer));
  }

  getIsSameAsLogged(value: number | Player): boolean {
    const idPlayer = isNumber(value) ? value : value.id;
    return this.getUser()?.idPlayer === idPlayer;
  }
}

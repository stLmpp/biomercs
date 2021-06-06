import { Store, StorePersistLocalStorageStrategy } from '@stlmpp/store';
import { Auth } from '@model/auth';
import { Injectable } from '@angular/core';

export class AuthPersistStrategy extends StorePersistLocalStorageStrategy<Auth> {
  getStore(state: Auth): string | undefined {
    return state.user?.token;
  }

  setStore(state: Auth, value: string): Auth {
    return { ...state, user: { ...state.user!, token: value } };
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends Store<Auth> {
  constructor() {
    super({ name: 'auth', initialState: { user: null }, persistStrategy: new AuthPersistStrategy() });
  }
}

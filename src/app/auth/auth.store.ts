import { Store, StorePersistStrategy } from '@stlmpp/store';
import { Auth } from '@model/auth';
import { Injectable } from '@angular/core';
import { del, get, set } from 'idb-keyval';
import { isNil } from 'st-utils';

export class AuthPersisStrategy2 implements StorePersistStrategy<Auth> {
  deserialize(value: string | undefined): string | undefined {
    return value;
  }

  async get(key: string): Promise<string | null | undefined> {
    return get(key);
  }

  getStore(state: Auth): string | undefined {
    return state.user?.token;
  }

  serialize(value: any): string | undefined {
    return value;
  }

  async set(key: string, value: string | undefined): Promise<void> {
    if (isNil(value)) {
      await del(key);
    } else {
      await set(key, value);
    }
  }

  setStore(state: Auth, value: string): Auth {
    return { ...state, user: { ...state.user!, token: value } };
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore extends Store<Auth> {
  constructor() {
    super({
      name: 'auth',
      initialState: { user: null },
      persistStrategy: new AuthPersisStrategy2(),
    });
  }
}

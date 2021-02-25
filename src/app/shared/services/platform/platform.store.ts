import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { environment } from '@environment/environment';
import { Platform } from '@model/platform';

export type PlatformState = EntityState<Platform>;

@Injectable({ providedIn: 'root' })
export class PlatformStore extends EntityStore<PlatformState> {
  constructor() {
    super({ name: 'platform', cache: environment.cacheTimeout });
  }
}

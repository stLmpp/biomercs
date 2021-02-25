import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { PlatformState, PlatformStore } from './platform.store';

@Injectable({ providedIn: 'root' })
export class PlatformQuery extends EntityQuery<PlatformState> {
  constructor(platformStore: PlatformStore) {
    super(platformStore);
  }
}

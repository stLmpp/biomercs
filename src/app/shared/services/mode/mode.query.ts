import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { ModeState, ModeStore } from './mode.store';

@Injectable({ providedIn: 'root' })
export class ModeQuery extends EntityQuery<ModeState> {
  constructor(modeStore: ModeStore) {
    super(modeStore);
  }
}

import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { Mode } from '@model/mode';

export type ModeState = EntityState<Mode>;

@Injectable({ providedIn: 'root' })
export class ModeStore extends EntityStore<ModeState> {
  constructor() {
    super({ name: 'mode' });
  }
}

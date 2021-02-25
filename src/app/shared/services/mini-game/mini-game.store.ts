import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { MiniGame } from '@model/mini-game';

export type MiniGameState = EntityState<MiniGame>;

@Injectable({ providedIn: 'root' })
export class MiniGameStore extends EntityStore<MiniGameState> {
  constructor() {
    super({ name: 'mini-game' });
  }
}

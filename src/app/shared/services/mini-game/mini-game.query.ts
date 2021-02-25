import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { MiniGameState, MiniGameStore } from './mini-game.store';

@Injectable({ providedIn: 'root' })
export class MiniGameQuery extends EntityQuery<MiniGameState> {
  constructor(miniGameStore: MiniGameStore) {
    super(miniGameStore);
  }
}

import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { GameState, GameStore } from './game.store';

@Injectable({ providedIn: 'root' })
export class GameQuery extends EntityQuery<GameState> {
  constructor(gameStore: GameStore) {
    super(gameStore);
  }
}

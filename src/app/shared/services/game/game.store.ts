import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { Game } from '@model/game';

export type GameState = EntityState<Game>;

@Injectable({ providedIn: 'root' })
export class GameStore extends EntityStore<GameState> {
  constructor() {
    super({ name: 'game' });
  }
}

import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { PlayerEntityState, PlayerStore } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends EntityQuery<PlayerEntityState> {
  constructor(playerStore: PlayerStore) {
    super(playerStore);
  }
}

import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { Player } from '@model/player';

export type PlayerEntityState = EntityState<Player>;

@Injectable({ providedIn: 'root' })
export class PlayerStore extends EntityStore<PlayerEntityState> {
  constructor() {
    super({ name: 'player' });
  }
}

import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { AuthStore } from '../auth/auth.store';
import { AuthQuery } from '../auth/auth.query';
import { Player } from '@model/player';

export type PlayerEntityState = EntityState<Player>;

@Injectable({ providedIn: 'root' })
export class PlayerStore extends EntityStore<PlayerEntityState> {
  constructor(private authStore: AuthStore, private authQuery: AuthQuery) {
    super({ name: 'player' });
  }

  private _updateUser(entity: Player): void {
    if (entity.idUser === this.authQuery.getUser()?.id) {
      // This can't happen if the user is not logged, so no need to worry here
      this.authStore.update(state => ({ ...state, user: { ...state.user!, player: entity } }));
    }
  }

  preAddEntity(entity: Player): Player {
    entity = super.preAddEntity(entity);
    this._updateUser(entity);
    return entity;
  }

  preUpdateEntity(entity: Player): Player {
    entity = super.preUpdateEntity(entity);
    this._updateUser(entity);
    return entity;
  }
}

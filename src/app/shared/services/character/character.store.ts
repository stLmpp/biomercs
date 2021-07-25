import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { CharacterWithCharacterCostumes } from '@model/character';

export type CharacterState = EntityState<CharacterWithCharacterCostumes>;

@Injectable({ providedIn: 'root' })
export class CharacterStore extends EntityStore<CharacterState> {
  constructor() {
    super({ name: 'character' });
  }
}

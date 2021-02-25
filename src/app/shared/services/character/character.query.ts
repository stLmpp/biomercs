import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { CharacterState, CharacterStore } from './character.store';

@Injectable({ providedIn: 'root' })
export class CharacterQuery extends EntityQuery<CharacterState> {
  constructor(characterStore: CharacterStore) {
    super(characterStore);
  }
}

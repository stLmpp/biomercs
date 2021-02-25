import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { Character } from '@model/character';

export type CharacterState = EntityState<Character>;

@Injectable({ providedIn: 'root' })
export class CharacterStore extends EntityStore<CharacterState> {
  constructor() {
    super({ name: 'character' });
  }
}

import { CharacterCostume } from './character-costume';
import { trackByFactory } from '@stlmpp/utils';

export interface Character {
  id: number;
  name: string;
}

export interface CharacterWithCharacterCostumes extends Character {
  characterCostumes: CharacterCostume[];
}

export const trackByCharacter = trackByFactory<CharacterWithCharacterCostumes>('id');

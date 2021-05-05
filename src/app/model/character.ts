import { Base } from './base';
import { CharacterCostume } from './character-costume';
import { trackByFactory } from '@stlmpp/utils';

export interface Character extends Base {
  name: string;
  characterCostumes: CharacterCostume[];
}

export const trackByCharacter = trackByFactory<Character>('id');

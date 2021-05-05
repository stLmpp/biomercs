import { Base } from './base';
import { trackByFactory } from '@stlmpp/utils';

export interface CharacterCostume extends Base {
  idCharacter: number;
  name: string;
  shortName: string;
}

export const trackByCharacterCostume = trackByFactory<CharacterCostume>('id');

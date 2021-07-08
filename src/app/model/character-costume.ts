import { trackByFactory } from '@stlmpp/utils';

export interface CharacterCostume {
  id: number;
  idCharacter: number;
  name: string;
  shortName: string;
}

export const trackByCharacterCostume = trackByFactory<CharacterCostume>('id');

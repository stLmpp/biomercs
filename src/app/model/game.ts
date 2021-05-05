import { Base } from './base';
import { trackByFactory } from '@stlmpp/utils';

export interface Game extends Base {
  name: string;
  shortName: string;
}

export const trackByGame = trackByFactory<Game>('id');

import { trackByFactory } from '@stlmpp/utils';

export interface Game {
  id: number;
  name: string;
  shortName: string;
}

export const trackByGame = trackByFactory<Game>('id');

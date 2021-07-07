import { trackByFactory } from '@stlmpp/utils';

export interface MiniGame {
  id: number;
  name: string;
}

export const trackByMiniGame = trackByFactory<MiniGame>('id');

import { trackByFactory } from '@stlmpp/utils';

export interface Mode {
  id: number;
  name: string;
  playerQuantity: number;
}

export const trackByMode = trackByFactory<Mode>('id');

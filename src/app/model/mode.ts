import { Base } from './base';
import { trackByFactory } from '@stlmpp/utils';

export interface Mode extends Base {
  name: string;
  playerQuantity: number;
}

export const trackByMode = trackByFactory<Mode>('id');

import { Base } from './base';
import { trackByFactory } from '@stlmpp/utils';

export interface MiniGame extends Base {
  name: string;
}

export const trackByMiniGame = trackByFactory<MiniGame>('id');

import { Base } from './base';
import { trackByFactory } from '@stlmpp/utils';

export interface Platform extends Base {
  name: string;
  shortName: string;
}

export const trackByPlatform = trackByFactory<Platform>('id');

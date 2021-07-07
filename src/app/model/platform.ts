import { trackByFactory } from '@stlmpp/utils';

export interface Platform {
  id: number;
  name: string;
  shortName: string;
}

export const trackByPlatform = trackByFactory<Platform>('id');

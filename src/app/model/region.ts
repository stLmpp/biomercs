import { trackByFactory } from '@stlmpp/utils';

export interface Region {
  id: number;
  name: string;
  shortName: string;
}

export const trackByRegion = trackByFactory<Region>('id');

import { trackByFactory } from '@stlmpp/utils';
import { Base } from '@model/base';

export interface Region extends Base {
  name: string;
  shortName: string;
}

export const trackByRegion = trackByFactory<Region>('id');

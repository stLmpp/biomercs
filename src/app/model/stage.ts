import { trackByFactory } from '@stlmpp/utils';

export interface Stage {
  id: number;
  name: string;
  shortName: string;
}

export const trackByStage = trackByFactory<Stage>('id');

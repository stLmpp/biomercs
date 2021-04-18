import { trackByFactory } from '@stlmpp/utils';

export interface IdDescription {
  id: number;
  description: string;
}

export const trackByIdDescription = trackByFactory<IdDescription>('id');

import { trackByFactory } from '@stlmpp/utils';

export const trackById = trackByFactory<{ id: number }>('id');
export const trackByIndex = trackByFactory<{}>();
export const trackByControl = trackByFactory<{ uniqueId: number }>('uniqueId');

import { trackByFactory } from '@stlmpp/utils';
import { ScoreVW } from '@model/score';

export interface ScoreChangeRequest {
  idScoreChangeRequest: number;
  description: string;
}

export interface ScoreChangeRequests extends ScoreVW {
  scoreChangeRequests: ScoreChangeRequest[];
}

export const trackByScoreChangeRequest = trackByFactory<ScoreChangeRequest>('idScoreChangeRequest');
export const trackByScoreChangeRequests = trackByFactory<ScoreChangeRequests>('idScore');

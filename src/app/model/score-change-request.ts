import { trackByFactory } from '@stlmpp/utils';
import { ScoreVW } from '@model/score';
import { PaginationMetaVW } from '@model/pagination';

export interface ScoreChangeRequest {
  idScoreChangeRequest: number;
  description: string;
}

export interface ScoreChangeRequests extends ScoreVW {
  scoreChangeRequests: ScoreChangeRequest[];
}

export interface ScoreChangeRequestsPaginationVW {
  meta: PaginationMetaVW;
  scores: ScoreChangeRequests[];
}

export const trackByScoreChangeRequest = trackByFactory<ScoreChangeRequest>('idScoreChangeRequest');
export const trackByScoreChangeRequests = trackByFactory<ScoreChangeRequests>('idScore');

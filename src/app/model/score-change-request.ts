import { trackByFactory } from '@stlmpp/utils';
import { ScoreVW } from '@model/score';
import { PaginationMetaVW } from '@model/pagination';

export interface ScoreChangeRequest {
  id: number;
  idScore: number;
  description: string;
  dateFulfilled?: Date;
}

export interface ScoreChangeRequests extends ScoreVW {
  scoreChangeRequests: ScoreChangeRequest[];
}

export interface ScoreChangeRequestsPaginationVW {
  meta: PaginationMetaVW;
  scores: ScoreChangeRequests[];
}

export const trackByScoreChangeRequest = trackByFactory<ScoreChangeRequest>('id');
export const trackByScoreChangeRequests = trackByFactory<ScoreChangeRequests>('idScore');

import { trackByFactory } from '@stlmpp/utils';
import { Score } from '@model/score';
import { PaginationMeta } from '@model/pagination';

export interface ScoreChangeRequest {
  id: number;
  idScore: number;
  description: string;
  dateFulfilled?: Date;
}

export interface ScoreChangeRequests extends Score {
  scoreChangeRequests: ScoreChangeRequest[];
}

export interface ScoreChangeRequestsPaginationVW {
  meta: PaginationMeta;
  scores: ScoreChangeRequests[];
}

export const trackByScoreChangeRequest = trackByFactory<ScoreChangeRequest>('id');
export const trackByScoreChangeRequests = trackByFactory<ScoreChangeRequests>('id');

import { Score } from '@model/score';
import { PaginationMeta } from '@model/pagination';

export interface ScoreChangeRequest {
  id: number;
  idScore: number;
  description: string;
  dateFulfilled?: Date;
}

export interface ScoreWithScoreChangeRequests extends Score {
  scoreChangeRequests: ScoreChangeRequest[];
}

export interface ScoreChangeRequestsPagination {
  meta: PaginationMeta;
  scores: ScoreWithScoreChangeRequests[];
}

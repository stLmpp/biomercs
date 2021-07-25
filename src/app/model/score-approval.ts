import { PaginationMeta } from '@model/pagination';
import { Score } from '@model/score';

export interface ScoreApprovalAdd {
  description: string;
  idScoreApprovalMotive: number;
}

export interface ScoreApprovalPagination {
  meta: PaginationMeta;
  scores: Score[];
}

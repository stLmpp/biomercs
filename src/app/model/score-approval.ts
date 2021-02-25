import { PaginationMetaVW } from '@model/pagination';
import { ScoreVW } from '@model/score';

export interface ScoreApprovalAdd {
  description: string;
  idScoreApprovalMotive: number;
}

export interface ScoreApprovalVW {
  meta: PaginationMetaVW;
  scores: ScoreVW[];
}

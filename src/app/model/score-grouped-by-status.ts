import { ScoreVW } from '@model/score';
import { trackByFactory } from '@stlmpp/utils';

export interface ScoreScoreGroupedByStatusScoreVW extends ScoreVW {
  disabled: boolean;
}

export interface ScoreGroupedByStatus {
  idScoreStatus: number;
  description: string;
  scores: ScoreScoreGroupedByStatusScoreVW[];
}

export const trackByScoreGroupedByStatus = trackByFactory<ScoreGroupedByStatus>('idScoreStatus');

import { Base } from '@model/base';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { trackByFactory } from '@stlmpp/utils';

export interface ScoreApprovalMotive extends Base {
  description: string;
  action: ScoreApprovalActionEnum;
}

export const trackByScoreApprovalMotive = trackByFactory<ScoreApprovalMotive>('id');

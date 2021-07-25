import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';

export interface ScoreApprovalMotive {
  id: number;
  description: string;
  action: ScoreApprovalActionEnum;
}

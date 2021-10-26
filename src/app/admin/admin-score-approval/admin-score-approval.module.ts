import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminScoreApprovalRoutingModule } from './admin-score-approval-routing.module';
import { AdminScoreApprovalComponent } from './admin-score-approval.component';
import { TitleModule } from '@shared/title/title.module';
import { ScoreApprovalModule } from '../../score/score-approval/score-approval.module';

@NgModule({
  declarations: [AdminScoreApprovalComponent],
  imports: [CommonModule, AdminScoreApprovalRoutingModule, ScoreApprovalModule, TitleModule],
})
export class AdminScoreApprovalModule {}

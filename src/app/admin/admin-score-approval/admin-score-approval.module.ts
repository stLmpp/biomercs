import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminScoreApprovalRoutingModule } from './admin-score-approval-routing.module';
import { AdminScoreApprovalComponent } from './admin-score-approval.component';
import { ScoreSharedModule } from '../../score/score-shared/score-shared.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [AdminScoreApprovalComponent],
  imports: [CommonModule, AdminScoreApprovalRoutingModule, ScoreSharedModule, TitleModule],
})
export class AdminScoreApprovalModule {}
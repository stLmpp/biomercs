import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerApprovalRoutingModule } from './player-approval-routing.module';
import { PlayerApprovalComponent } from './player-approval.component';
import { ScoreSharedModule } from '../../score/score-shared/score-shared.module';

@NgModule({
  declarations: [PlayerApprovalComponent],
  imports: [CommonModule, PlayerApprovalRoutingModule, ScoreSharedModule],
})
export class PlayerApprovalModule {}

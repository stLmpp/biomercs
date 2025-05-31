import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminScoreApprovalRoutingModule } from './admin-score-approval-routing.module';
import { AdminScoreApprovalComponent } from './admin-score-approval.component';

@NgModule({
  imports: [CommonModule, AdminScoreApprovalRoutingModule, AdminScoreApprovalComponent],
})
export class AdminScoreApprovalModule {}

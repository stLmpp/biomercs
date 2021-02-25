import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ScoreApprovalAdminComponent } from './score-approval-admin/score-approval-admin.component';
import { ScoreSharedModule } from '../score/score-shared/score-shared.module';

@NgModule({
  declarations: [AdminComponent, ScoreApprovalAdminComponent],
  imports: [CommonModule, AdminRoutingModule, ScoreSharedModule],
})
export class AdminModule {}

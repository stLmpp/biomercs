import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerApprovalRoutingModule } from './player-approval-routing.module';
import { PlayerApprovalComponent } from './player-approval.component';

@NgModule({
  declarations: [PlayerApprovalComponent],
  imports: [CommonModule, PlayerApprovalRoutingModule],
})
export class PlayerApprovalModule {}

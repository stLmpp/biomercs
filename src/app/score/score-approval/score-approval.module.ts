import { NgModule } from '@angular/core';
import { ScoreApprovalComponent } from './score-approval.component';
import { ScoreApprovalModalComponent } from './score-approval-modal/score-approval-modal.component';
import { ScoreApprovalActionsCellComponent } from './score-approval-actions-cell/score-approval-actions-cell.component';
import { ScoreApprovalActionsModalComponent } from './score-approval-actions-modal/score-approval-actions-modal.component';
import { ScoreOpenInfoCellComponent } from './score-open-info-cell/score-open-info-cell.component';
import { ScoreInfoModule } from '../score-info/score-info.module';
import { ScoreListModule } from '../score-list/score-list.module';
import { ParamsModule } from '@shared/params/params.module';

const DECLARATIONS = [
  ScoreApprovalComponent,
  ScoreApprovalModalComponent,
  ScoreApprovalActionsCellComponent,
  ScoreApprovalActionsModalComponent,
  ScoreOpenInfoCellComponent,
];
const MODULES = [ScoreInfoModule, ScoreListModule, ParamsModule];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [MODULES],
  exports: [DECLARATIONS, MODULES],
})
export class ScoreApprovalModule {}

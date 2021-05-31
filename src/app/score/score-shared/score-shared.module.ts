import { NgModule } from '@angular/core';
import { ScoreApprovalComponent } from './score-approval/score-approval.component';
import { ParamsModule } from '@shared/params/params.module';
import { ScoreApprovalModalComponent } from './score-approval/score-approval-modal/score-approval-modal.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';
import { ScoreInfoComponent } from './score-info/score-info.component';
import { RouterModule } from '@angular/router';
import { ScoreInfoModalComponent } from './score-info/score-info-modal/score-info-modal.component';
import { UrlPreviewModule } from '@shared/url-preview/url-preview.module';
import { ScoreRequestChangesModalComponent } from './score-approval/score-request-changes-modal/score-request-changes-modal.component';
import { ScoreListComponent } from './score-list/score-list.component';
import { ScoreFormatPipe } from './score-format.pipe';
import { ListModule } from '@shared/components/list/list.module';
import { ScoreListResponsiveComponent } from './score-list-responsive/score-list-responsive.component';
import { TableModule } from '@shared/components/table/table.module';
import { ScoreApprovalActionsCellComponent } from './score-approval/score-approval-actions-cell/score-approval-actions-cell.component';
import { ScoreApprovalActionsModalComponent } from './score-approval/score-approval-actions-modal/score-approval-actions-modal.component';
import { ScoreOpenInfoCellComponent } from './score-open-info-cell/score-open-info-cell.component';
import { TextFieldModule } from '@angular/cdk/text-field';

const DECLARATIONS = [
  ScoreApprovalComponent,
  ScoreApprovalModalComponent,
  ScoreInfoComponent,
  ScoreInfoModalComponent,
  ScoreRequestChangesModalComponent,
  ScoreFormatPipe,
  ScoreListComponent,
  ScoreListResponsiveComponent,
  ScoreApprovalActionsCellComponent,
  ScoreApprovalActionsModalComponent,
  ScoreOpenInfoCellComponent,
];
const MODULES = [
  ParamsModule,
  TableModule,
  ModalModule,
  TextFieldModule,
  AuthSharedModule,
  RouterModule,
  UrlPreviewModule,
  ListModule,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class ScoreSharedModule {}

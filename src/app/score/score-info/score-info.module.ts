import { NgModule } from '@angular/core';
import { ScoreInfoComponent } from './score-info.component';
import { ScoreInfoModalComponent } from './score-info-modal/score-info-modal.component';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { RouterModule } from '@angular/router';
import { UrlPreviewModule } from '@shared/url-preview/url-preview.module';

const MODULES = [AuthSharedModule, ModalModule, ButtonModule, TooltipModule, RouterModule, UrlPreviewModule];

@NgModule({
  declarations: [ScoreInfoComponent, ScoreInfoModalComponent],
  imports: [MODULES],
  exports: [ScoreInfoComponent, MODULES],
})
export class ScoreInfoModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerChangeRequestsRoutingModule } from './player-change-requests-routing.module';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { AuthSharedModule } from '../../auth/shared/auth-shared.module';
import { ArrayModule } from '@shared/array/array.module';
import { PlayerChangeRequestsModalComponent } from './player-change-requests-modal/player-change-requests-modal.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';
import { UrlPreviewModule } from '@shared/url-preview/url-preview.module';
import { CurrencyMaskModule } from '@shared/currency-mask/currency-mask.module';
import { MaskModule } from '@shared/mask/mask.module';
import { PlayerChangeRequestsActionCellComponent } from './player-change-requests-action-cell/player-change-requests-action-cell.component';
import { ScoreSharedModule } from '../../score/score-shared/score-shared.module';

@NgModule({
  declarations: [
    PlayerChangeRequestsComponent,
    PlayerChangeRequestsModalComponent,
    PlayerChangeRequestsActionCellComponent,
  ],
  imports: [
    CommonModule,
    PlayerChangeRequestsRoutingModule,
    CardModule,
    PaginationModule,
    SpinnerModule,
    ButtonModule,
    TooltipModule,
    IconModule,
    NgLetModule,
    AuthSharedModule,
    ArrayModule,
    ModalModule,
    StControlModule,
    FormModule,
    UrlPreviewModule,
    CurrencyMaskModule,
    MaskModule,
    ScoreSharedModule,
  ],
})
export class PlayerChangeRequestsModule {}

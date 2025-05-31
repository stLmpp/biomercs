import { NgModule } from '@angular/core';

import { PlayerChangeRequestsRoutingModule } from './player-change-requests-routing.module';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';
import { PlayerChangeRequestsModalComponent } from './player-change-requests-modal/player-change-requests-modal.component';
import { CurrencyMaskModule } from '@shared/currency-mask/currency-mask.module';
import { MaskModule } from '@shared/mask/mask.module';
import { PlayerChangeRequestsActionCellComponent } from './player-change-requests-action-cell/player-change-requests-action-cell.component';

@NgModule({
  imports: [
    PlayerChangeRequestsRoutingModule,
    CurrencyMaskModule,
    MaskModule,
    PlayerChangeRequestsComponent,
    PlayerChangeRequestsModalComponent,
    PlayerChangeRequestsActionCellComponent,
  ],
})
export class PlayerChangeRequestsModule {}

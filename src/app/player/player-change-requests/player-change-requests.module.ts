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

@NgModule({
  declarations: [PlayerChangeRequestsComponent],
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
  ],
})
export class PlayerChangeRequestsModule {}

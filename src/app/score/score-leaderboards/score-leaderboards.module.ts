import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreLeaderboardsRoutingModule } from './score-leaderboards-routing.module';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { StControlModule } from '@stlmpp/control';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ScoreLeaderboardsComponent } from './score-leaderboards.component';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [ScoreLeaderboardsComponent],
  imports: [
    CommonModule,
    ScoreLeaderboardsRoutingModule,
    CardModule,
    ParamsModule,
    SpinnerModule,
    NgLetModule,
    ButtonModule,
    IconModule,
    StControlModule,
    PaginationModule,
    TooltipModule,
    TitleModule,
  ],
})
export class ScoreLeaderboardsModule {}

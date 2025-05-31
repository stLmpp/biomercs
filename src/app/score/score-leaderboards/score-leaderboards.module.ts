import { NgModule } from '@angular/core';
import { ScoreLeaderboardsRoutingModule } from './score-leaderboards-routing.module';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ScoreLeaderboardsComponent } from './score-leaderboards.component';

@NgModule({
  imports: [ScoreLeaderboardsRoutingModule, ParamsModule, CardModule, PaginationModule, ScoreLeaderboardsComponent],
})
export class ScoreLeaderboardsModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { ScoreLeaderboardsComponent } from './score-leaderboards.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: ScoreLeaderboardsComponent,
    resolve: [PlatformResolver],
    data: {
      [RouteDataEnum.title]: 'Leaderboards',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreLeaderboardsRoutingModule {}

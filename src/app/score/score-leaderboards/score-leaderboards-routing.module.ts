import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { platformResolver } from '@shared/services/platform/platform.resolver';
import { ScoreLeaderboardsComponent } from './score-leaderboards.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: ScoreLeaderboardsComponent,
    resolve: {
      [RouteDataEnum.platforms]: platformResolver(),
    },
    data: {
      [RouteDataEnum.title]: 'Leaderboards',
      [RouteDataEnum.meta]: createMeta({ title: 'Leaderboards', description: 'Leaderboards' }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreLeaderboardsRoutingModule {}

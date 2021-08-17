import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { PlayerProfileTitleResolver } from './player-profile.title-resolver';
import { PlayerRejectedPendingScoresResolver } from './player-rejected-pending-scores.resolver';
import { createMeta } from '@shared/meta/meta';
import { PlayerResolver } from '../player.resolver';

const routes: Routes = [
  {
    path: '',
    component: PlayerProfileComponent,
    resolve: {
      [RouteDataEnum.scoreGroupedByStatus]: PlayerRejectedPendingScoresResolver,
      [RouteDataEnum.player]: PlayerResolver,
    },
    data: {
      [RouteDataEnum.title]: PlayerProfileTitleResolver,
      [RouteDataEnum.meta]: createMeta({ title: 'Player profile', description: 'Player profile' }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerProfileRoutingModule {}

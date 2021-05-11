import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile.component';
import { PlayerResolver } from '../player.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { PlayerProfileTitleResolver } from './player-profile.title-resolver';

const routes: Routes = [
  {
    path: '',
    component: PlayerProfileComponent,
    resolve: [PlayerResolver],
    data: {
      [RouteDataEnum.title]: PlayerProfileTitleResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerProfileRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';
import { playerChangeRequestsResolver } from './player-change-requests.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: PlayerChangeRequestsComponent,
    resolve: {
      data: playerChangeRequestsResolver(),
    },
    data: {
      [RouteDataEnum.title]: 'Change requests',
      [RouteDataEnum.meta]: createMeta({
        title: 'Player change requests',
        description: 'Change scores when requested by the admins',
      }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerChangeRequestsRoutingModule {}

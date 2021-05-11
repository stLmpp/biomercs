import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';
import { PlayerChangeRequestsResolver } from './player-change-requests.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: PlayerChangeRequestsComponent,
    resolve: {
      data: PlayerChangeRequestsResolver,
    },
    data: {
      [RouteDataEnum.title]: 'Change requests',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerChangeRequestsRoutingModule {}

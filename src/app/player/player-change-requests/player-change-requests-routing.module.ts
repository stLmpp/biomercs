import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';
import { PlayerChangeRequestsResolver } from './player-change-requests.resolver';

const routes: Routes = [
  {
    path: '',
    component: PlayerChangeRequestsComponent,
    resolve: {
      data: PlayerChangeRequestsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerChangeRequestsRoutingModule {}

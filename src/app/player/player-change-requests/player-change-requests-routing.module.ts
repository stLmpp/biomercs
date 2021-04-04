import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerChangeRequestsComponent } from './player-change-requests.component';

const routes: Routes = [
  {
    path: '',
    component: PlayerChangeRequestsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerChangeRequestsRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfileComponent } from './player-profile.component';
import { PlayerResolver } from '../player.resolver';

const routes: Routes = [
  {
    path: '',
    component: PlayerProfileComponent,
    resolve: [PlayerResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerProfileRoutingModule {}

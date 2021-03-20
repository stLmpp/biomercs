import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScoreTopTableComponent } from './score-top-table/score-top-table.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { ScoreAddComponent } from './score-add/score-add.component';
import { AuthPlayerResolver } from '../auth/auth-player.resolver';

const routes: Routes = [
  {
    path: 'leaderboards',
    component: ScoreTopTableComponent,
    resolve: [PlatformResolver],
  },
  {
    path: 'add',
    component: ScoreAddComponent,
    resolve: [PlatformResolver, AuthPlayerResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRoutingModule {}

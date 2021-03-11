import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScoreTopTableComponent } from './score-top-table/score-top-table.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';

const routes: Routes = [
  {
    path: 'leaderboards',
    component: ScoreTopTableComponent,
    resolve: [PlatformResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRoutingModule {}

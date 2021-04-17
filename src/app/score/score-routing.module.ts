import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'leaderboards',
    loadChildren: () => import('./score-leaderboards/score-leaderboards.module').then(m => m.ScoreLeaderboardsModule),
  },
  {
    path: 'add',
    loadChildren: () => import('./score-add/score-add.module').then(m => m.ScoreAddModule),
  },
  {
    path: 'world-record',
    loadChildren: () => import('./score-world-record/score-world-record.module').then(m => m.ScoreWorldRecordModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRoutingModule {}

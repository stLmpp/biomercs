import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'add',
    loadChildren: () => import('./score-add/score-add.module').then(m => m.ScoreAddModule),
  },
  {
    path: 'leaderboards',
    loadChildren: () => import('./score-leaderboards/score-leaderboards.module').then(m => m.ScoreLeaderboardsModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./score-search/score-search.module').then(m => m.ScoreSearchModule),
  },
  {
    path: 'world-records',
    loadChildren: () => import('./score-world-record/score-world-record.module').then(m => m.ScoreWorldRecordModule),
  },
  {
    path: '**',
    loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreRoutingModule {}

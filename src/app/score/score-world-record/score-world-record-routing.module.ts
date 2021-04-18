import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreWorldRecordTableComponent } from './score-world-record-table/score-world-record-table.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { ScoreWorldRecordHistoryComponent } from './score-world-record-history/score-world-record-history.component';

const routes: Routes = [
  {
    path: 'table',
    component: ScoreWorldRecordTableComponent,
    resolve: [PlatformResolver],
  },
  {
    path: 'history',
    component: ScoreWorldRecordHistoryComponent,
    resolve: [PlatformResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreWorldRecordRoutingModule {}

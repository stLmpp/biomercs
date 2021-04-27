import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreWorldRecordTableComponent } from './score-world-record-table/score-world-record-table.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';

const routes: Routes = [
  {
    path: 'table',
    component: ScoreWorldRecordTableComponent,
    resolve: [PlatformResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreWorldRecordRoutingModule {}

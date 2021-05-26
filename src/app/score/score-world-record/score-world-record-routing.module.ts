import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreWorldRecordTableComponent } from './score-world-record-table/score-world-record-table.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: 'table',
    component: ScoreWorldRecordTableComponent,
    resolve: [PlatformResolver],
    data: {
      [RouteDataEnum.title]: 'World records',
      [RouteDataEnum.meta]: createMeta({ title: 'World records', description: 'Table with all world records' }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreWorldRecordRoutingModule {}

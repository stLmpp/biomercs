import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreWorldRecordsComponent } from './score-world-records.component';
import { platformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: ScoreWorldRecordsComponent,
    resolve: {
      [RouteDataEnum.platforms]: platformResolver(),
    },
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

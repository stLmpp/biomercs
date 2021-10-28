import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreSearchComponent } from './score-search.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: ScoreSearchComponent,
    resolve: {
      [RouteDataEnum.platforms]: PlatformResolver,
    },
    data: {
      [RouteDataEnum.title]: 'Search scores',
      [RouteDataEnum.meta]: createMeta({
        title: 'Search scores',
        description: 'Search scores with all possible filters',
      }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreSearchRoutingModule {}

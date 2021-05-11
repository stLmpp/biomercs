import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScoreSearchComponent } from './score-search.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: ScoreSearchComponent,
    resolve: [PlatformResolver],
    data: {
      [RouteDataEnum.title]: 'Search scores',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreSearchRoutingModule {}

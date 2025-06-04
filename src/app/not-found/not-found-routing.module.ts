import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';
import { notFoundResolver } from './not-found.resolver';

export const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
    data: {
      [RouteDataEnum.title]: '404 - Not found',
      [RouteDataEnum.meta]: createMeta({
        title: '404 - Not found',
        description: `The page you're looking doesn't appear to exist`,
      }),
    },
    resolve: {
      [RouteDataEnum.possiblePaths]: notFoundResolver(),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotFoundRoutingModule {}

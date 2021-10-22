import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent } from './forum.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: ForumComponent,
    data: {
      [RouteDataEnum.title]: 'Forum',
      [RouteDataEnum.meta]: createMeta({
        title: 'Forum',
        description: 'Forum',
      }),
      [RouteDataEnum.breadcrumbs]: 'Forum',
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./forum-categories/forum-categories.module').then(m => m.ForumCategoriesModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumRoutingModule {}

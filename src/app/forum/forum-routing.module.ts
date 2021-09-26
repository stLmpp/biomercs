import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumComponent } from './forum.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { RouteParamEnum } from '@model/enum/route-param.enum';
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
      {
        path: `category/:${RouteParamEnum.idCategory}/sub-category/:${RouteParamEnum.idSubCategory}`,
        loadChildren: () =>
          import('./forum-sub-category/forum-sub-category.module').then(m => m.ForumSubCategoryModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumRoutingModule {}

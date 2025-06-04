import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumCategoriesComponent } from './forum-categories.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { categoriesWithRecentTopicsResolver } from '../resolver/categories-with-recent-topics.resolver';
import { RouteParamEnum } from '@model/enum/route-param.enum';

const routes: Routes = [
  {
    path: '',
    component: ForumCategoriesComponent,
    resolve: {
      [RouteDataEnum.categoriesWithRecentTopics]: categoriesWithRecentTopicsResolver(),
    },
  },
  {
    path: `category/:${RouteParamEnum.idCategory}/sub-category/:${RouteParamEnum.idSubCategory}`,
    loadChildren: () => import('../forum-sub-category/forum-sub-category.module').then(m => m.ForumSubCategoryModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumCategoriesRoutingModule {}

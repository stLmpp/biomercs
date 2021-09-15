import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumCategoriesComponent } from './forum-categories.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { CategoriesWithRecentTopicsResolver } from '../resolver/categories-with-recent-topics.resolver';

const routes: Routes = [
  {
    path: '',
    component: ForumCategoriesComponent,
    resolve: {
      [RouteDataEnum.categoriesWithRecentTopics]: CategoriesWithRecentTopicsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumCategoriesRoutingModule {}

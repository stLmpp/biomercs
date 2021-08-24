import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumCategoriesComponent } from './forum-categories.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { CategoriesResolver } from '../resolver/categories.resolver';

const routes: Routes = [
  {
    path: '',
    component: ForumCategoriesComponent,
    resolve: {
      [RouteDataEnum.categories]: CategoriesResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumCategoriesRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumSubCategoryComponent } from './forum-sub-category.component';
import { SubCategoryWithTopicsResolver } from '../resolver/sub-category-with-topics.resolver';

const routes: Routes = [
  {
    path: '',
    component: ForumSubCategoryComponent,
    resolve: [SubCategoryWithTopicsResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumSubCategoryRoutingModule {}

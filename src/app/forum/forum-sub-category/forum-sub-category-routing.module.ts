import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumSubCategoryComponent } from './forum-sub-category.component';
import { SubCategoryWithTopicsResolver } from '../resolver/sub-category-with-topics.resolver';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: `page/:${RouteParamEnum.pageSubCategory}`,
    component: ForumSubCategoryComponent,
    resolve: {
      [RouteDataEnum.subCategoryWithTopics]: SubCategoryWithTopicsResolver,
    },
  },
  {
    path: `topic/:${RouteParamEnum.idTopic}`,
    children: [
      {
        path: '',
        canActivate: [], // TODO redirect to page/{pageSubCategory}/topic/{idTopic}
      },
      {
        path: `post/:${RouteParamEnum.idPost}`,
        canActivate: [], // TODO redirect to page/{pageSubCategory}/topic/{idTopic}/page/{pageTopic}#{idPost}
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumSubCategoryRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumSubCategoryComponent } from './forum-sub-category.component';
import { SubCategoryWithTopicsResolver } from '../resolver/sub-category-with-topics.resolver';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { ForumSubCategoryBreadcrumbResolver } from './forum-sub-category.breadcrumb-resolver';
import { ForumRedirectTopicPostGuard } from '../guard/forum-redirect-topic-post.guard';

const routes: Routes = [
  {
    path: `page/:${RouteParamEnum.pageSubCategory}`,
    resolve: {
      [RouteDataEnum.subCategoryWithTopics]: SubCategoryWithTopicsResolver,
    },
    data: {
      [RouteDataEnum.breadcrumbs]: ForumSubCategoryBreadcrumbResolver,
    },
    children: [
      {
        path: '',
        component: ForumSubCategoryComponent,
        resolve: {
          [RouteDataEnum.subCategoryWithTopics]: SubCategoryWithTopicsResolver,
        },
      },
      {
        path: 'topic/new',
        loadChildren: () => import('../forum-topic-new/forum-topic-new.module').then(m => m.ForumTopicNewModule),
      },
      {
        path: `topic/:${RouteParamEnum.idTopic}`,
        loadChildren: () => import('../forum-topic/forum-topic.module').then(m => m.ForumTopicModule),
      },
    ],
  },
  {
    path: `topic/:${RouteParamEnum.idTopic}/post/:${RouteParamEnum.idPost}`,
    canActivate: [ForumRedirectTopicPostGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumSubCategoryRoutingModule {}

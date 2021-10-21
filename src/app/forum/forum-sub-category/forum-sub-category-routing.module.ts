import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumSubCategoryComponent } from './forum-sub-category.component';
import { SubCategoryWithTopicsResolver } from '../resolver/sub-category-with-topics.resolver';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { ForumSubCategoryBreadcrumbResolver } from './forum-sub-category.breadcrumb-resolver';

const routes: Routes = [
  {
    path: `page/:${RouteParamEnum.pageSubCategory}`,
    data: {
      [RouteDataEnum.breadcrumbs]: ForumSubCategoryBreadcrumbResolver,
    },
    resolve: {
      [RouteDataEnum.subCategoryWithTopics]: SubCategoryWithTopicsResolver,
    },
    runGuardsAndResolvers: 'always',
    children: [
      {
        path: '',
        component: ForumSubCategoryComponent,
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

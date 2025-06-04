import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { ForumTopicComponent } from './forum-topic.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { ForumTopicBreadcrumbsResolver } from './forum-topic.breadcrumbs-resolver';
import { topicIncreaseViewsResolver } from '../resolver/topic-increase-views.resolver';
import { topicWithPostsResolver } from '../resolver/topic-with-posts.resolver';

const routes: Routes = [
  {
    path: `page/:${RouteParamEnum.pageTopic}`,
    component: ForumTopicComponent,
    data: {
      [RouteDataEnum.breadcrumbs]: ForumTopicBreadcrumbsResolver,
    },
    resolve: {
      [RouteDataEnum.topicIncreaseViews]: topicIncreaseViewsResolver(),
      [RouteDataEnum.topicWithPosts]: topicWithPostsResolver(),
    },
  },
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class ForumTopicRoutingModule {}

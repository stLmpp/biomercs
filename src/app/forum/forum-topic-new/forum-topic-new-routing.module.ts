import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumTopicNewComponent } from './forum-topic-new.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: ForumTopicNewComponent,
    data: {
      [RouteDataEnum.breadcrumbs]: 'New topic',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumTopicNewRoutingModule {}

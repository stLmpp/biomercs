import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMailQueueComponent } from './admin-mail-queue.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { AdminMailQueueResolver } from './admin-mail-queue.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminMailQueueComponent,
    data: {
      [RouteDataEnum.title]: 'Mail queue',
    },
    resolve: {
      [RouteDataEnum.mailQueue]: AdminMailQueueResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminMailQueueRoutingModule {}

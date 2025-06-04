import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminMailQueueComponent } from './admin-mail-queue.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { adminMailQueueResolver } from './admin-mail-queue.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminMailQueueComponent,
    data: {
      [RouteDataEnum.title]: 'Mail queue',
    },
    resolve: {
      [RouteDataEnum.mailQueue]: adminMailQueueResolver(),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminMailQueueRoutingModule {}

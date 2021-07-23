import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminErrorsComponent } from './admin-errors.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { ErrorResolver } from '@shared/services/error/error.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminErrorsComponent,
    resolve: {
      [RouteDataEnum.errors]: ErrorResolver,
    },
    data: {
      [RouteDataEnum.title]: 'Errors',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminErrorsRoutingModule {}

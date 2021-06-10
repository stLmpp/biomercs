import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBanUserComponent } from './admin-ban-user.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: AdminBanUserComponent,
    data: {
      [RouteDataEnum.title]: 'Ban user',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminBanUserRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      [RouteDataEnum.title]: 'Login',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}

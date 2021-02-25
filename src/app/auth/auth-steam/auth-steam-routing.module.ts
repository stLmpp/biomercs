import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SteamRegisterComponent } from './steam-register/steam-register.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { SteamRegisterGuard } from './steam-register/steam-register.guard';
import { RouteParamEnum } from '@model/enum/route-param.enum';

const routes: Routes = [
  {
    path: `:${RouteParamEnum.steamid}`,
    canActivate: [SteamRegisterGuard],
    children: [
      {
        path: 'register',
        component: SteamRegisterComponent,
      },
      {
        path: 'confirm',
        component: SteamRegisterComponent,
        data: { [RouteDataEnum.confirm]: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthSteamRoutingModule {}

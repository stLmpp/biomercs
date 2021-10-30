import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SteamRegisterComponent } from './steam-register/steam-register.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { SteamRegisterGuard } from './steam-register/steam-register.guard';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { createMeta } from '@shared/meta/meta';
import { SteamValidateNamesResolver } from './steam-register/steam-validate-names.resolver';

const routes: Routes = [
  {
    path: `:${RouteParamEnum.steamid}`,
    canActivate: [SteamRegisterGuard],
    children: [
      {
        path: 'register',
        component: SteamRegisterComponent,
        data: {
          [RouteDataEnum.title]: 'Register (steam)',
          [RouteDataEnum.meta]: createMeta({ title: 'Register steam', description: 'Register steam' }),
        },
        resolve: {
          [RouteDataEnum.steamValidateNames]: SteamValidateNamesResolver,
        },
      },
      {
        path: 'confirm',
        component: SteamRegisterComponent,
        data: {
          [RouteDataEnum.confirm]: true,
          [RouteDataEnum.title]: 'Confirm (steam)',
          [RouteDataEnum.meta]: createMeta({
            title: 'Register steam confirmation',
            description: 'Register steam confirmation',
          }),
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthSteamRoutingModule {}

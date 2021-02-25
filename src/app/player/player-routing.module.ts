import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { ProfilePersonaNameGuard } from './profile/profile-persona-name.guard';
import { PlayerResolver } from './player.resolver';
import { ProfileIdUserGuard } from './profile/profile-id-user.guard';
import { RouteParamEnum } from '@model/enum/route-param.enum';

const routes: Routes = [
  {
    path: `p/:${RouteParamEnum.personaName}`,
    canActivate: [ProfilePersonaNameGuard],
  },
  {
    path: `u/:${RouteParamEnum.idUser}`,
    canActivate: [ProfileIdUserGuard],
  },
  {
    path: `:${RouteParamEnum.idPlayer}`,
    component: ProfileComponent,
    resolve: [PlayerResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}

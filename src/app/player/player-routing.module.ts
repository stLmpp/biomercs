import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfilePersonaNameGuard } from './player-profile/player-profile-persona-name.guard';
import { PlayerProfileIdUserGuard } from './player-profile/player-profile-id-user.guard';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PlayerChangeRequestsIdUserGuard } from './player-change-requests/player-change-requests-id-user.guard';

const routes: Routes = [
  {
    path: `p/:${RouteParamEnum.personaName}`,
    canActivate: [PlayerProfilePersonaNameGuard],
  },
  {
    path: `u/:${RouteParamEnum.idUser}`,
    children: [
      {
        path: '',
        canActivate: [PlayerProfileIdUserGuard],
      },
      {
        path: 'change-requests',
        canActivate: [PlayerChangeRequestsIdUserGuard],
      },
    ],
  },
  {
    path: `:${RouteParamEnum.idPlayer}`,
    children: [
      {
        path: '',
        loadChildren: () => import('./player-profile/player-profile.module').then(m => m.PlayerProfileModule),
      },
      {
        path: 'change-requests',
        loadChildren: () =>
          import('./player-change-requests/player-change-requests.module').then(m => m.PlayerChangeRequestsModule),
      },
    ],
  },
  {
    path: '**',
    loadChildren: () => import('../not-found/not-found.module').then(m => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}

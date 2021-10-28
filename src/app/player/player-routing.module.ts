import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfilePersonaNameGuard } from './player-profile/player-profile-persona-name.guard';
import { RouteParamEnum } from '@model/enum/route-param.enum';

const routes: Routes = [
  {
    path: `p/:${RouteParamEnum.personaName}`,
    canActivate: [PlayerProfilePersonaNameGuard],
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

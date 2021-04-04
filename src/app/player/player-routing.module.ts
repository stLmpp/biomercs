import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerProfilePersonaNameGuard } from './player-profile/player-profile-persona-name.guard';
import { PlayerProfileIdUserGuard } from './player-profile/player-profile-id-user.guard';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PlayerApprovalIdUserGuard } from './player-approval/player-approval-id-user.guard';
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
        path: 'approval',
        canActivate: [PlayerApprovalIdUserGuard],
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
        path: 'approval',
        loadChildren: () => import('./player-approval/player-approval.module').then(m => m.PlayerApprovalModule),
      },
      {
        path: 'change-requests',
        loadChildren: () =>
          import('./player-change-requests/player-change-requests.module').then(m => m.PlayerChangeRequestsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}

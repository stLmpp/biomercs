import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerApprovalComponent } from './player-approval.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';

const routes: Routes = [
  {
    path: '',
    component: PlayerApprovalComponent,
    resolve: [PlatformResolver],
    data: {
      [RouteDataEnum.title]: 'Score approval',
      [RouteDataEnum.meta]: createMeta({
        title: 'Player score approval',
        description: 'Approve the scores submitted by your partners',
      }),
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerApprovalRoutingModule {}

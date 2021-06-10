import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerApprovalComponent } from './player-approval.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { createMeta } from '@shared/meta/meta';
import { PlatformApprovalResolver } from '@shared/services/platform/platform-approval.resolver';

const routes: Routes = [
  {
    path: '',
    component: PlayerApprovalComponent,
    resolve: {
      [RouteDataEnum.platformApproval]: PlatformApprovalResolver,
    },
    data: {
      [RouteDataEnum.title]: 'Score approval',
      [RouteDataEnum.meta]: createMeta({
        title: 'Player score approval',
        description: 'Approve the scores submitted by your partners',
      }),
      [RouteDataEnum.platformResolverPlayerMode]: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerApprovalRoutingModule {}

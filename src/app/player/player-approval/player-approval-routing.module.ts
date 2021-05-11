import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerApprovalComponent } from './player-approval.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: PlayerApprovalComponent,
    resolve: [PlatformResolver],
    data: {
      [RouteDataEnum.title]: 'Score approval',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerApprovalRoutingModule {}

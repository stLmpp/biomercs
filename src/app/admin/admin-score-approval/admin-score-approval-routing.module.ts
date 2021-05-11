import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminScoreApprovalComponent } from './admin-score-approval.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: AdminScoreApprovalComponent,
    resolve: [PlatformResolver],
    data: {
      [RouteDataEnum.title]: 'Score approval (admin)',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminScoreApprovalRoutingModule {}

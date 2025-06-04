import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminScoreApprovalComponent } from './admin-score-approval.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { platformApprovalResolver } from '@shared/services/platform/platform-approval.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminScoreApprovalComponent,
    resolve: {
      [RouteDataEnum.platformApproval]: platformApprovalResolver(),
    },
    data: {
      [RouteDataEnum.title]: 'Score approval',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminScoreApprovalRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminScoreApprovalComponent } from './admin-score-approval.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminScoreApprovalComponent,
    resolve: [PlatformResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminScoreApprovalRoutingModule {}

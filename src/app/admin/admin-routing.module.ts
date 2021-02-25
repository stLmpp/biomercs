import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ScoreApprovalAdminComponent } from './score-approval-admin/score-approval-admin.component';
import { PlatformResolver } from '@shared/services/platform/platform.resolver';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'approval',
    component: ScoreApprovalAdminComponent,
    resolve: [PlatformResolver],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

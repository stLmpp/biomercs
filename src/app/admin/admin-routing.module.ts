import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
  },
  {
    path: 'approval',
    loadChildren: () =>
      import('./admin-score-approval/admin-score-approval.module').then(m => m.AdminScoreApprovalModule),
  },
  {
    path: 'create-player',
    loadChildren: () => import('./admin-create-player/admin-create-player.module').then(m => m.AdminCreatePlayerModule),
  },
  {
    path: 'rules',
    loadChildren: () => import('./admin-rules/admin-rules.module').then(m => m.AdminRulesModule),
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
export class AdminRoutingModule {}

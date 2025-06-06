import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { RouteDataEnum } from '@model/enum/route-data.enum';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    data: {
      [RouteDataEnum.title]: 'Admin',
    },
  },
  {
    path: 'approval',
    loadChildren: () =>
      import('./admin-score-approval/admin-score-approval.module').then(m => m.AdminScoreApprovalModule),
  },
  {
    path: 'ban-user',
    loadChildren: () => import('./admin-ban-user/admin-ban-user.module').then(m => m.AdminBanUserModule),
  },
  {
    path: 'create-player',
    loadChildren: () => import('./admin-create-player/admin-create-player.module').then(m => m.AdminCreatePlayerModule),
  },
  { path: 'errors', loadChildren: () => import('./admin-errors/admin-errors.module').then(m => m.AdminErrorsModule) },
  {
    path: 'mail-queue',
    loadChildren: () => import('./admin-mail-queue/admin-mail-queue.module').then(m => m.AdminMailQueueModule),
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

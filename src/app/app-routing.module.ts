import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthAdminGuard } from './auth/auth-admin.guard';
import { AuthLoggedGuard } from './auth/auth-logged.guard';

const routes: Routes = [
  { path: '', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), pathMatch: 'full' },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canLoad: [AuthAdminGuard],
  },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'contact', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
  {
    path: 'player',
    loadChildren: () => import('./player/player.module').then(m => m.PlayerModule),
    canLoad: [AuthLoggedGuard],
  },
  {
    path: 'score',
    loadChildren: () => import('./score/score.module').then(m => m.ScoreModule),
    canLoad: [AuthLoggedGuard],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollOffset: [0, 74],
      enableTracing: false,
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

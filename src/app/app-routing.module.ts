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
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule) },
  {
    path: 'player',
    loadChildren: () => import('./player/player.module').then(m => m.PlayerModule),
    canLoad: [AuthLoggedGuard],
  },
  { path: 'rules', loadChildren: () => import('./rules/rules.module').then(m => m.RulesModule) },
  {
    path: 'score',
    loadChildren: () => import('./score/score.module').then(m => m.ScoreModule),
    canLoad: [AuthLoggedGuard],
  },
  {
    path: 'stlmpp',
    loadChildren: () => import('./stlmpp/stlmpp.module').then(m => m.StlmppModule),
  },
  { path: '**', loadChildren: () => import('./not-found/not-found.module').then(m => m.NotFoundModule) },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'disabled',
      scrollOffset: [0, 74],
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthNotLoggedGuard } from './auth-not-logged.guard';
import { AuthLoggedGuard } from './auth-logged.guard';

const routes: Routes = [
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule),
    canLoad: [AuthLoggedGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canLoad: [AuthNotLoggedGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canLoad: [AuthNotLoggedGuard],
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    canLoad: [AuthNotLoggedGuard],
  },
  {
    path: 'steam',
    loadChildren: () => import('./auth-steam/auth-steam.module').then(m => m.AuthSteamModule),
    canLoad: [AuthNotLoggedGuard],
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
export class AuthRoutingModule {}

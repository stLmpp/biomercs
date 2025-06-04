import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authNotLoggedGuard } from './auth-not-logged.guard';
import { authLoggedGuard } from './auth-logged.guard';

const routes: Routes = [
  {
    path: 'change-password',
    loadChildren: () => import('./change-password/change-password.module').then(m => m.ChangePasswordModule),
    canMatch: [authLoggedGuard()],
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canMatch: [authNotLoggedGuard()],
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canMatch: [authNotLoggedGuard()],
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    canMatch: [authNotLoggedGuard()],
  },
  {
    path: 'steam',
    loadChildren: () => import('./auth-steam/auth-steam.module').then(m => m.AuthSteamModule),
    canMatch: [authNotLoggedGuard()],
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

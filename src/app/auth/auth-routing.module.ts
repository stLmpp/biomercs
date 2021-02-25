import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotLoggedGuard } from './not-logged.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
    canLoad: [NotLoggedGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canLoad: [NotLoggedGuard],
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterModule),
    canLoad: [NotLoggedGuard],
  },
  {
    path: `steam`,
    loadChildren: () => import('./auth-steam/auth-steam.module').then(m => m.AuthSteamModule),
    canLoad: [NotLoggedGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}

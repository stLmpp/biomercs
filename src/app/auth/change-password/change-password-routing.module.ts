import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { ChangePasswordConfirmComponent } from './change-password-confirm/change-password-confirm.component';
import { ChangePasswordValidateGuard } from './change-password-validate.guard';

const routes: Routes = [
  {
    path: '',
    component: ChangePasswordComponent,
  },
  {
    path: `confirm/:${RouteParamEnum.key}`,
    component: ChangePasswordConfirmComponent,
    canActivate: [ChangePasswordValidateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChangePasswordRoutingModule {}

import { NgModule } from '@angular/core';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordConfirmComponent } from './change-password-confirm/change-password-confirm.component';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  imports: [
    ChangePasswordRoutingModule,
    AuthSharedModule,
    CardModule,
    ButtonModule,
    ChangePasswordComponent,
    ChangePasswordConfirmComponent,
  ],
})
export class ChangePasswordModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForgotPasswordRoutingModule } from './forgot-password-routing.module';
import { SnackBarModule } from '@shared/components/snack-bar/snack-bar.module';
import { ForgotPasswordComponent } from './forgot-password.component';
import { StControlModule } from '@stlmpp/control';
import { NgLetModule } from '@shared/let/ng-let.module';
import { CardModule } from '@shared/components/card/card.module';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { FormModule } from '@shared/components/form/form.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [
    CommonModule,
    ForgotPasswordRoutingModule,
    SnackBarModule,
    StControlModule,
    NgLetModule,
    CardModule,
    AuthSharedModule,
    FormModule,
    ButtonModule,
  ],
})
export class ForgotPasswordModule {}

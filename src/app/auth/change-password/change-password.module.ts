import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChangePasswordRoutingModule } from './change-password-routing.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordConfirmComponent } from './change-password-confirm/change-password-confirm.component';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  declarations: [ChangePasswordComponent, ChangePasswordConfirmComponent],
  imports: [CommonModule, ChangePasswordRoutingModule, CardModule, ButtonModule],
})
export class ChangePasswordModule {}

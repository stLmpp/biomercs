import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginConfirmCodeModalComponent } from './login-confirm-code-modal/login-confirm-code-modal.component';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';

@NgModule({
  declarations: [LoginComponent, LoginConfirmCodeModalComponent],
  imports: [CommonModule, LoginRoutingModule, AuthSharedModule, ModalModule, ButtonModule, CardModule, CheckboxModule],
})
export class LoginModule {}

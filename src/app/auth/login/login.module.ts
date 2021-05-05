import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { LoginConfirmCodeModalComponent } from './login-confirm-code-modal/login-confirm-code-modal.component';
import { StControlModule } from '@stlmpp/control';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { ModalModule } from '@shared/components/modal/modal.module';
import { SnackBarModule } from '@shared/components/snack-bar/snack-bar.module';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';

@NgModule({
  declarations: [LoginComponent, LoginConfirmCodeModalComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    StControlModule,
    CardModule,
    FormModule,
    ButtonModule,
    IconModule,
    ModalModule,
    SnackBarModule,
    AuthSharedModule,
    NgLetModule,
    CheckboxModule,
  ],
})
export class LoginModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { StControlModule } from '@stlmpp/control';
import { CardModule } from '@shared/components/card/card.module';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { FormModule } from '@shared/components/form/form.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@shared/let/ng-let.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RegisterRoutingModule,
    StControlModule,
    CardModule,
    AuthSharedModule,
    FormModule,
    IconModule,
    ButtonModule,
    NgLetModule,
  ],
})
export class RegisterModule {}

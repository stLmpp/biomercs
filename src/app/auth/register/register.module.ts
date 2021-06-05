import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { CardModule } from '@shared/components/card/card.module';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@stlmpp/utils';

@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, RegisterRoutingModule, AuthSharedModule, CardModule, NgLetModule, ButtonModule],
})
export class RegisterModule {}

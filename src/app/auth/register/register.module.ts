import { NgModule } from '@angular/core';

import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { AuthSharedModule } from '../shared/auth-shared.module';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  declarations: [RegisterComponent],
  imports: [RegisterRoutingModule, AuthSharedModule, CardModule, ButtonModule],
})
export class RegisterModule {}

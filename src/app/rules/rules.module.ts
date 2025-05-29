import { NgModule } from '@angular/core';
import { RulesRoutingModule } from './rules-routing.module';
import { RulesComponent } from './rules.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { SelectModule } from '@shared/components/select/select.module';
import { StControlModule } from '@stlmpp/control';

@NgModule({
  imports: [RulesRoutingModule, CardModule, ButtonModule, FormModule, SelectModule, StControlModule, RulesComponent],
})
export class RulesModule {}

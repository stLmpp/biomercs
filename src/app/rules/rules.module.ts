import { NgModule } from '@angular/core';
import { RulesRoutingModule } from './rules-routing.module';
import { RulesComponent } from './rules.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { CardModule } from '@shared/components/card/card.module';

@NgModule({
  declarations: [RulesComponent],
  imports: [RulesRoutingModule, CardModule, ButtonModule],
})
export class RulesModule {}

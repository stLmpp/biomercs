import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StlmppRoutingModule } from './stlmpp-routing.module';
import { StlmppComponent } from './stlmpp.component';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@stlmpp/utils';

@NgModule({
  declarations: [StlmppComponent],
  imports: [CommonModule, StlmppRoutingModule, CardModule, ButtonModule, NgLetModule],
})
export class StlmppModule {}

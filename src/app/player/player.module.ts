import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerRoutingModule } from './player-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { CardModule } from '@shared/components/card/card.module';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    CardModule,
    StControlModule,
    FormModule,
    ButtonModule,
    IconModule,
    TooltipModule,
  ],
})
export class PlayerModule {}

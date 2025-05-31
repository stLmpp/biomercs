import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCreatePlayerRoutingModule } from './admin-create-player-routing.module';
import { AdminCreatePlayerComponent } from './admin-create-player.component';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { ButtonModule } from '@shared/components/button/button.module';
import { SelectModule } from '@shared/components/select/select.module';

import { NgLetModule } from '@stlmpp/utils';
import { FlagModule } from '@shared/components/icon/flag/flag.module';

@NgModule({
  imports: [
    CommonModule,
    AdminCreatePlayerRoutingModule,
    FormModule,
    CardModule,
    StControlModule,
    NgLetModule,
    SelectModule,
    ButtonModule,
    FlagModule,
    AdminCreatePlayerComponent,
  ],
})
export class AdminCreatePlayerModule {}

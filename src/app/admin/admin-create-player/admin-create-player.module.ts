import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminCreatePlayerRoutingModule } from './admin-create-player-routing.module';
import { AdminCreatePlayerComponent } from './admin-create-player.component';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { ButtonModule } from '@shared/components/button/button.module';
import { SelectModule } from '@shared/components/select/select.module';
import { FlagModule } from '@shared/components/icon/flag/flag.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [AdminCreatePlayerComponent],
  imports: [
    CommonModule,
    AdminCreatePlayerRoutingModule,
    CardModule,
    FormModule,
    StControlModule,
    ButtonModule,
    SelectModule,
    FlagModule,
    NgLetModule,
    TitleModule,
  ],
})
export class AdminCreatePlayerModule {}

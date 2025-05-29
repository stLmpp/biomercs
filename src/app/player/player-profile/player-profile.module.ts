import { NgModule } from '@angular/core';

import { PlayerProfileRoutingModule } from './player-profile-routing.module';
import { PlayerProfileComponent } from './player-profile.component';
import { PlayerCanUpdatePersonaNamePipe } from './player-can-update-persona-name.pipe';

import { FlagModule } from '@shared/components/icon/flag/flag.module';
import { PlayerProfileInvalidPipe } from './player-profile-invalid.pipe';

import { FormModule } from '@shared/components/form/form.module';

import { StControlModule } from '@stlmpp/control';

@NgModule({
  imports: [
    PlayerProfileRoutingModule,
    FlagModule,
    FormModule,
    StControlModule,
    PlayerProfileComponent,
    PlayerCanUpdatePersonaNamePipe,
    PlayerProfileInvalidPipe,
  ],
})
export class PlayerProfileModule {}

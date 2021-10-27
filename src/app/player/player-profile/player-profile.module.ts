import { NgModule } from '@angular/core';

import { PlayerProfileRoutingModule } from './player-profile-routing.module';
import { PlayerProfileComponent } from './player-profile.component';
import { PlayerCanUpdatePersonaNamePipe } from './player-can-update-persona-name.pipe';
import { DateModule } from '@shared/date/date.module';
import { FlagModule } from '@shared/components/icon/flag/flag.module';
import { PlayerProfileInvalidPipe } from './player-profile-invalid.pipe';
import { ScoreListModule } from '../../score/score-list/score-list.module';
import { FormModule } from '@shared/components/form/form.module';
import { PlayerAvatarModule } from '../player-avatar/player-avatar.module';
import { StControlModule } from '@stlmpp/control';

@NgModule({
  declarations: [PlayerProfileComponent, PlayerCanUpdatePersonaNamePipe, PlayerProfileInvalidPipe],
  imports: [
    PlayerProfileRoutingModule,
    DateModule,
    FlagModule,
    ScoreListModule,
    FormModule,
    PlayerAvatarModule,
    StControlModule,
  ],
})
export class PlayerProfileModule {}

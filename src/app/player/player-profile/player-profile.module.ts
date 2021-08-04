import { NgModule } from '@angular/core';

import { PlayerProfileRoutingModule } from './player-profile-routing.module';
import { PlayerProfileComponent } from './player-profile.component';
import { ScoreSharedModule } from '../../score/score-shared/score-shared.module';
import { PlayerCanUpdatePersonaNamePipe } from './player-can-update-persona-name.pipe';
import { DateModule } from '@shared/date/date.module';
import { FlagModule } from '@shared/components/icon/flag/flag.module';

@NgModule({
  declarations: [PlayerProfileComponent, PlayerCanUpdatePersonaNamePipe],
  imports: [PlayerProfileRoutingModule, ScoreSharedModule, DateModule, FlagModule],
})
export class PlayerProfileModule {}

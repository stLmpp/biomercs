import { NgModule } from '@angular/core';

import { PlayerProfileRoutingModule } from './player-profile-routing.module';
import { PlayerProfileComponent } from './player-profile.component';
import { ScoreSharedModule } from '../../score/score-shared/score-shared.module';
import { PlayerCanUpdatePersonaNamePipe } from './player-can-update-persona-name.pipe';
import { DateModule } from '@shared/date/date.module';

@NgModule({
  declarations: [PlayerProfileComponent, PlayerCanUpdatePersonaNamePipe],
  imports: [PlayerProfileRoutingModule, ScoreSharedModule, DateModule],
})
export class PlayerProfileModule {}

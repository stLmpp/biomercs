import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlayerProfileRoutingModule } from './player-profile-routing.module';
import { CardModule } from '@shared/components/card/card.module';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { PlayerProfileComponent } from './player-profile.component';
import { ScoreSharedModule } from '../../score/score-shared/score-shared.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { ValidationModule } from '@shared/validators/validation.module';
import { PlayerCanUpdatePersonaNamePipe } from './player-can-update-persona-name.pipe';
import { DateModule } from '@shared/date/date.module';

@NgModule({
  declarations: [PlayerProfileComponent, PlayerCanUpdatePersonaNamePipe],
  imports: [
    CommonModule,
    PlayerProfileRoutingModule,
    CardModule,
    StControlModule,
    FormModule,
    ButtonModule,
    IconModule,
    TooltipModule,
    ScoreSharedModule,
    NgLetModule,
    ValidationModule,
    DateModule,
  ],
})
export class PlayerProfileModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { ScoreTopTableComponent } from './score-top-table/score-top-table.component';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { StControlModule } from '@stlmpp/control';
import { PaginationModule } from '@shared/components/pagination/pagination.module';

@NgModule({
  declarations: [ScoreTopTableComponent],
  imports: [
    CommonModule,
    ScoreRoutingModule,
    CardModule,
    ParamsModule,
    SpinnerModule,
    NgLetModule,
    ButtonModule,
    IconModule,
    StControlModule,
    PaginationModule,
  ],
})
export class ScoreModule {}

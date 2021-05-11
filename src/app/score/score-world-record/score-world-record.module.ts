import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreWorldRecordRoutingModule } from './score-world-record-routing.module';
import { ScoreWorldRecordTableComponent } from './score-world-record-table/score-world-record-table.component';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { ScoreSharedModule } from '../score-shared/score-shared.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [ScoreWorldRecordTableComponent],
  imports: [
    CommonModule,
    ScoreWorldRecordRoutingModule,
    CardModule,
    ParamsModule,
    NgLetModule,
    SpinnerModule,
    ScoreSharedModule,
    IconModule,
    TooltipModule,
    ButtonModule,
    TitleModule,
  ],
})
export class ScoreWorldRecordModule {}

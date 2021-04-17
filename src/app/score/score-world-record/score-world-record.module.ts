import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreWorldRecordRoutingModule } from './score-world-record-routing.module';
import { ScoreWorldRecordTableComponent } from './score-world-record-table/score-world-record-table.component';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { IconModule } from '@shared/components/icon/icon.module';

@NgModule({
  declarations: [ScoreWorldRecordTableComponent],
  imports: [
    CommonModule,
    ScoreWorldRecordRoutingModule,
    CardModule,
    ParamsModule,
    SpinnerModule,
    TooltipModule,
    ButtonModule,
    NgLetModule,
    IconModule,
  ],
})
export class ScoreWorldRecordModule {}

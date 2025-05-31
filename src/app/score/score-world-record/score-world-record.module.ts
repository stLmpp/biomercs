import { NgModule } from '@angular/core';
import { ScoreWorldRecordRoutingModule } from './score-world-record-routing.module';
import { ScoreWorldRecordsComponent } from './score-world-records.component';

import { ParamsModule } from '@shared/params/params.module';

@NgModule({
  imports: [ScoreWorldRecordRoutingModule, ParamsModule, ScoreWorldRecordsComponent],
})
export class ScoreWorldRecordModule {}

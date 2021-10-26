import { NgModule } from '@angular/core';
import { ScoreWorldRecordRoutingModule } from './score-world-record-routing.module';
import { ScoreWorldRecordsComponent } from './score-world-records.component';
import { ScoreListModule } from '../score-list/score-list.module';
import { TitleModule } from '@shared/title/title.module';
import { ParamsModule } from '@shared/params/params.module';

@NgModule({
  declarations: [ScoreWorldRecordsComponent],
  imports: [ScoreWorldRecordRoutingModule, ScoreListModule, TitleModule, ParamsModule],
})
export class ScoreWorldRecordModule {}

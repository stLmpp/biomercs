import { NgModule } from '@angular/core';
import { ScoreWorldRecordRoutingModule } from './score-world-record-routing.module';
import { ScoreWorldRecordsComponent } from './score-world-records.component';
import { ScoreSharedModule } from '../score-shared/score-shared.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [ScoreWorldRecordsComponent],
  imports: [ScoreWorldRecordRoutingModule, ScoreSharedModule, TitleModule],
})
export class ScoreWorldRecordModule {}

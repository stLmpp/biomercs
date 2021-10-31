import { NgModule } from '@angular/core';
import { ScoreFormatPipe } from './score-format.pipe';

@NgModule({
  declarations: [ScoreFormatPipe],
  exports: [ScoreFormatPipe],
})
export class ScoreFormatModule {}

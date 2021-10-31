import { NgModule } from '@angular/core';
import { ScoreRequestChangesModalComponent } from './score-request-changes-modal.component';
import { ScoreInfoModule } from '../score-info/score-info.module';
import { TextFieldModule } from '@angular/cdk/text-field';

const MODULES = [ScoreInfoModule, TextFieldModule];

@NgModule({
  declarations: [ScoreRequestChangesModalComponent],
  imports: [MODULES],
  exports: [MODULES],
})
export class ScoreRequestChangesModalModule {}

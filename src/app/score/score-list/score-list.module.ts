import { NgModule } from '@angular/core';
import { ScoreListComponent } from './score-list/score-list.component';
import { ScoreListResponsiveComponent } from './score-list-responsive/score-list-responsive.component';
import { TableModule } from '@shared/components/table/table.module';
import { ListModule } from '@shared/components/list/list.module';
import { ScoreFormatModule } from '../score-format/score-format.module';

const DECLARATIONS = [ScoreListComponent, ScoreListResponsiveComponent];
const MODULES = [TableModule, ListModule, ScoreFormatModule];

@NgModule({
  declarations: [DECLARATIONS],
  imports: [MODULES],
  exports: [DECLARATIONS, MODULES],
})
export class ScoreListModule {}

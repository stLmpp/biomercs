import { NgModule } from '@angular/core';
import { ScoreSearchRoutingModule } from './score-search-routing.module';
import { ScoreSearchComponent } from './score-search.component';
import { ScoreSharedModule } from '../score-shared/score-shared.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [ScoreSearchComponent],
  imports: [ScoreSearchRoutingModule, ScoreSharedModule, TitleModule],
})
export class ScoreSearchModule {}

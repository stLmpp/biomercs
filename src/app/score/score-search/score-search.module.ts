import { NgModule } from '@angular/core';
import { ScoreSearchRoutingModule } from './score-search-routing.module';
import { ScoreSearchComponent } from './score-search.component';
import { ScoreListModule } from '../score-list/score-list.module';
import { TitleModule } from '@shared/title/title.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';

@NgModule({
  declarations: [ScoreSearchComponent],
  imports: [ScoreSearchRoutingModule, ScoreListModule, TitleModule, FormModule, StControlModule],
})
export class ScoreSearchModule {}

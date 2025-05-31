import { NgModule } from '@angular/core';
import { ScoreSearchRoutingModule } from './score-search-routing.module';
import { ScoreSearchComponent } from './score-search.component';

import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';

@NgModule({
  imports: [ScoreSearchRoutingModule, FormModule, StControlModule, ScoreSearchComponent],
})
export class ScoreSearchModule {}

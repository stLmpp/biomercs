import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreSearchRoutingModule } from './score-search-routing.module';
import { ScoreSearchComponent } from './score-search.component';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { ScoreSharedModule } from '../score-shared/score-shared.module';

@NgModule({
  declarations: [ScoreSearchComponent],
  imports: [CommonModule, ScoreSearchRoutingModule, CardModule, FormModule, StControlModule, ScoreSharedModule],
})
export class ScoreSearchModule {}

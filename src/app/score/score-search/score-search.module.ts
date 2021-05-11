import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreSearchRoutingModule } from './score-search-routing.module';
import { ScoreSearchComponent } from './score-search.component';
import { CardModule } from '@shared/components/card/card.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { ScoreSharedModule } from '../score-shared/score-shared.module';
import { SelectModule } from '@shared/components/select/select.module';
import { CheckboxModule } from '@shared/components/checkbox/checkbox.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { TitleModule } from '@shared/title/title.module';

@NgModule({
  declarations: [ScoreSearchComponent],
  imports: [
    CommonModule,
    ScoreSearchRoutingModule,
    CardModule,
    FormModule,
    StControlModule,
    ScoreSharedModule,
    SelectModule,
    CheckboxModule,
    ButtonModule,
    NgLetModule,
    TitleModule,
  ],
})
export class ScoreSearchModule {}

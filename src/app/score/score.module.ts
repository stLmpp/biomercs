import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScoreRoutingModule } from './score-routing.module';
import { ScoreTopTableComponent } from './score-top-table/score-top-table.component';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { StControlModule } from '@stlmpp/control';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ScoreAddComponent } from './score-add/score-add.component';
import { FormModule } from '@shared/components/form/form.module';
import { CurrencyMaskModule } from '@shared/currency-mask/currency-mask.module';
import { MaskModule } from '@shared/mask/mask.module';
import { SelectModule } from '@shared/components/select/select.module';
import { AutocompleteModule } from '@shared/components/autocomplete/autocomplete.module';
import { ScoreAddPlayerComponent } from './score-add/score-add-player/score-add-player.component';
import { UrlPreviewModule } from '@shared/url-preview/url-preview.module';

@NgModule({
  declarations: [ScoreTopTableComponent, ScoreAddComponent, ScoreAddPlayerComponent],
  imports: [
    CommonModule,
    ScoreRoutingModule,
    CardModule,
    ParamsModule,
    SpinnerModule,
    NgLetModule,
    ButtonModule,
    IconModule,
    StControlModule,
    PaginationModule,
    FormModule,
    CurrencyMaskModule.forChild(),
    MaskModule.forChild(),
    SelectModule,
    AutocompleteModule,
    UrlPreviewModule,
  ],
})
export class ScoreModule {}

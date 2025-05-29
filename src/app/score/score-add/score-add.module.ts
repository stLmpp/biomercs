import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreAddRoutingModule } from './score-add-routing.module';
import { UrlPreviewModule } from '@shared/url-preview/url-preview.module';
import { CurrencyMaskModule } from '@shared/currency-mask/currency-mask.module';
import { ScoreAddComponent } from './score-add.component';
import { ScoreAddPlayerComponent } from './score-add-player/score-add-player.component';
import { AutocompleteModule } from '@shared/components/autocomplete/autocomplete.module';
import { MaskModule } from '@shared/mask/mask.module';
import { CardModule } from '@shared/components/card/card.module';
import { ParamsModule } from '@shared/params/params.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

import { DatepickerModule } from '@shared/components/datepicker/datepicker.module';

@NgModule({
  imports: [
    CommonModule,
    ScoreAddRoutingModule,
    CurrencyMaskModule.forFeature(),
    MaskModule.forFeature(),
    ParamsModule,
    UrlPreviewModule,
    CardModule,
    AutocompleteModule,
    ButtonModule,
    TooltipModule,
    DatepickerModule,
    ScoreAddComponent,
    ScoreAddPlayerComponent,
  ],
})
export class ScoreAddModule {}

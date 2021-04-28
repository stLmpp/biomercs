import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreAddRoutingModule } from './score-add-routing.module';
import { UrlPreviewModule } from '@shared/url-preview/url-preview.module';
import { CurrencyMaskModule } from '@shared/currency-mask/currency-mask.module';
import { ScoreAddComponent } from './score-add.component';
import { ScoreAddPlayerComponent } from './score-add-player/score-add-player.component';
import { AutocompleteModule } from '@shared/components/autocomplete/autocomplete.module';
import { FormModule } from '@shared/components/form/form.module';
import { SelectModule } from '@shared/components/select/select.module';
import { MaskModule } from '@shared/mask/mask.module';
import { CardModule } from '@shared/components/card/card.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { ParamsModule } from '@shared/params/params.module';
import { StControlModule } from '@stlmpp/control';
import { ButtonModule } from '@shared/components/button/button.module';
import { SpinnerModule } from '@shared/components/spinner/spinner.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';

@NgModule({
  declarations: [ScoreAddComponent, ScoreAddPlayerComponent],
  imports: [
    CommonModule,
    ScoreAddRoutingModule,
    FormModule,
    CurrencyMaskModule.forChild(),
    MaskModule.forChild(),
    SelectModule,
    AutocompleteModule,
    UrlPreviewModule,
    CardModule,
    NgLetModule,
    ParamsModule,
    StControlModule,
    ButtonModule,
    SpinnerModule,
    IconModule,
    TooltipModule,
  ],
})
export class ScoreAddModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { AccordionModule } from '@shared/components/accordion/accordion.module';
import { TitleModule } from '@shared/title/title.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { IconModule } from '@shared/components/icon/icon.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { FormModule } from '@shared/components/form/form.module';
import { StControlModule } from '@stlmpp/control';
import { FilterModule } from '@shared/filter/filter.module';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    FaqRoutingModule,
    AccordionModule,
    TitleModule,
    ButtonModule,
    TooltipModule,
    IconModule,
    NgLetModule,
    FormModule,
    StControlModule,
    FilterModule,
  ],
})
export class FaqModule {}

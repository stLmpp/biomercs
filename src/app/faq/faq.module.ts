import { NgModule } from '@angular/core';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqComponent } from './faq.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { FormModule } from '@shared/components/form/form.module';
import { TitleModule } from '@shared/title/title.module';
import { AccordionModule } from '@shared/components/accordion/accordion.module';
import { NgLetModule } from '@shared/let/ng-let.module';
import { FilterModule } from '@shared/filter/filter.module';
import { TooltipModule } from '@shared/components/tooltip/tooltip.module';
import { StControlModule } from '@stlmpp/control';

@NgModule({
  declarations: [FaqComponent],
  imports: [
    FaqRoutingModule,
    AccordionModule,
    FilterModule,
    FormModule,
    TitleModule,
    ButtonModule,
    TooltipModule,
    NgLetModule,
    StControlModule,
  ],
})
export class FaqModule {}

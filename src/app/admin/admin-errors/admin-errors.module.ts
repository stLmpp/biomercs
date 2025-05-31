import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminErrorsRoutingModule } from './admin-errors-routing.module';
import { AdminErrorsComponent } from './admin-errors.component';
import { PaginationModule } from '@shared/components/pagination/pagination.module';

import { AccordionModule } from '@shared/components/accordion/accordion.module';
import { HighlightModule } from '@shared/highlight/highlight.module';

@NgModule({
  imports: [
    CommonModule,
    AdminErrorsRoutingModule,
    PaginationModule,
    AccordionModule,
    HighlightModule,
    AdminErrorsComponent,
  ],
})
export class AdminErrorsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminErrorsRoutingModule } from './admin-errors-routing.module';
import { AdminErrorsComponent } from './admin-errors.component';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { TitleModule } from '@shared/title/title.module';
import { AccordionModule } from '@shared/components/accordion/accordion.module';
import { HighlightModule } from '@shared/highlight/highlight.module';

@NgModule({
  declarations: [AdminErrorsComponent],
  imports: [CommonModule, AdminErrorsRoutingModule, PaginationModule, TitleModule, AccordionModule, HighlightModule],
})
export class AdminErrorsModule {}

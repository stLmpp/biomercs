import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionDirective } from './accordion.directive';
import { AccordionItemComponent } from './accordion-item.component';
import { IconModule } from '@shared/components/icon/icon.module';
import { AccordionItemTitleDirective } from '@shared/components/accordion/accordion-item-title.directive';
import { CollapseModule } from '@shared/components/collapse/collapse.module';

const DECLARATIONS = [AccordionDirective, AccordionItemComponent, AccordionItemTitleDirective];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, IconModule, CollapseModule],
  exports: [...DECLARATIONS],
})
export class AccordionModule {}

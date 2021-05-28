import { Directive, Output, EventEmitter } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';

@Directive()
export abstract class Accordion extends CdkAccordion {
  @Output() readonly itemExpanded = new EventEmitter<string>();
  @Output() readonly itemCollapsed = new EventEmitter<string>();
}

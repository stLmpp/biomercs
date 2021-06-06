import { Directive, EventEmitter, Output } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Directive()
export abstract class Accordion extends CdkAccordion {
  @Output() readonly itemExpanded = new EventEmitter<string>();
  @Output() readonly itemCollapsed = new EventEmitter<string>();

  abstract focusKeyManager?: FocusKeyManager<any>;
}

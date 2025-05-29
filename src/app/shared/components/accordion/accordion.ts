import { Directive, output } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Directive()
export abstract class Accordion extends CdkAccordion {
  readonly itemExpanded = output<string>();
  readonly itemCollapsed = output<string>();

  abstract focusKeyManager?: FocusKeyManager<any>;
}

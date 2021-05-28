import { Directive } from '@angular/core';
import { CdkAccordion, ɵangular_material_src_cdk_accordion_accordion_a } from '@angular/cdk/accordion';

@Directive({
  selector: 'bio-accordion, [bioAccordion]',
  providers: [
    { provide: CdkAccordion, useExisting: AccordionDirective },
    // I know, it's uggly, but they forgot to export the CDK_ACCORDION
    { provide: ɵangular_material_src_cdk_accordion_accordion_a, useExisting: AccordionDirective },
  ],
  host: { class: 'accordion' },
})
export class AccordionDirective extends CdkAccordion {}

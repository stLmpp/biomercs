import { Directive } from '@angular/core';

@Directive({
    selector: '[bioAccordionItemTitle], bio-accordion-item-title',
    host: { class: 'accordion-item-title' },
    standalone: false
})
export class AccordionItemTitleDirective {}

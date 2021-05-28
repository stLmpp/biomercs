import { ContentChildren, Directive, QueryList } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import { Accordion } from '@shared/components/accordion/accordion';
import { AccordionItemComponent } from '@shared/components/accordion/accordion-item.component';

@Directive({
  selector: 'bio-accordion, [bioAccordion]',
  providers: [
    { provide: CdkAccordion, useExisting: AccordionDirective },
    { provide: Accordion, useExisting: AccordionDirective },
  ],
  host: { class: 'accordion' },
  exportAs: 'bioAccordion',
})
export class AccordionDirective extends Accordion {
  @ContentChildren(AccordionItemComponent) accordionItemComponents?: QueryList<AccordionItemComponent>;

  private _findAccordionItem(id: string): AccordionItemComponent | undefined {
    return this.accordionItemComponents?.find(accordionItemComponent => accordionItemComponent.id === id);
  }

  toggleItem(id: string): void {
    this._findAccordionItem(id)?.toggle();
  }

  expandItem(id: string): void {
    const item = this._findAccordionItem(id);
    if (item) {
      item.expanded = true;
    }
  }

  collapseItem(id: string): void {
    const item = this._findAccordionItem(id);
    if (item) {
      item.expanded = false;
    }
  }
}

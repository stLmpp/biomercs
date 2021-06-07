import { AfterContentInit, ContentChildren, Directive, QueryList } from '@angular/core';
import { CdkAccordion } from '@angular/cdk/accordion';
import { Accordion } from '@shared/components/accordion/accordion';
import { AccordionItemComponent } from '@shared/components/accordion/accordion-item.component';
import { FocusKeyManager } from '@angular/cdk/a11y';

@Directive({
  selector: 'bio-accordion, [bioAccordion]',
  providers: [
    { provide: CdkAccordion, useExisting: AccordionDirective },
    { provide: Accordion, useExisting: AccordionDirective },
  ],
  host: { class: 'accordion' },
  exportAs: 'bioAccordion',
})
export class AccordionDirective extends Accordion implements AfterContentInit {
  @ContentChildren(AccordionItemComponent) accordionItemComponents?: QueryList<AccordionItemComponent>;

  focusKeyManager?: FocusKeyManager<AccordionItemComponent>;

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

  focusItem(id: string): void {
    const index = this.accordionItemComponents
      ?.toArray()
      .findIndex(accordionItemComponent => accordionItemComponent.id === id);
    if (index && index > -1) {
      this.focusKeyManager?.setActiveItem(index);
    }
  }

  ngAfterContentInit(): void {
    if (!this.accordionItemComponents) {
      return;
    }
    this.focusKeyManager = new FocusKeyManager<AccordionItemComponent>(this.accordionItemComponents)
      .withVerticalOrientation()
      .skipPredicate(item => item.disabled);
  }
}

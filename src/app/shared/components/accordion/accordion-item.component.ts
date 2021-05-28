import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { AccordionItemTitleDirective } from '@shared/components/accordion/accordion-item-title.directive';
import { Animations } from '@shared/animations/animations';

@Component({
  selector: 'bio-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkAccordionItem, useExisting: AccordionItemComponent }],
  host: { class: 'accordion-item' },
  animations: [Animations.collapse.collapse(), Animations.collapse.collapseIcon()],
  encapsulation: ViewEncapsulation.None,
})
export class AccordionItemComponent extends CdkAccordionItem {
  @Input() accordionTitle?: string;

  @ContentChildren(AccordionItemTitleDirective) accordionItemTitleDirectives!: QueryList<AccordionItemTitleDirective>;

  @HostBinding('class.expanded')
  get expandedClass(): boolean {
    return this.expanded;
  }
  @HostBinding('class.disabled')
  get disabledClass(): boolean {
    return this.disabled;
  }
}

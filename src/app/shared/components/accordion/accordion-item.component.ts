import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Host,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { AccordionItemTitleDirective } from '@shared/components/accordion/accordion-item-title.directive';
import { Animations } from '@shared/animations/animations';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { Accordion } from '@shared/components/accordion/accordion';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bio-accordion-item',
  templateUrl: './accordion-item.component.html',
  styleUrls: ['./accordion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkAccordionItem, useExisting: AccordionItemComponent }],
  host: { class: 'accordion-item', '[attr.id]': 'id' },
  animations: [Animations.collapse.collapse(), Animations.collapse.collapseIcon()],
  encapsulation: ViewEncapsulation.None,
  inputs: ['id'],
})
export class AccordionItemComponent extends CdkAccordionItem implements OnInit, OnDestroy {
  constructor(
    @Host() @Optional() private _accordion: Accordion,
    changeDetectorRef: ChangeDetectorRef,
    uniqueSelectionDispatcher: UniqueSelectionDispatcher
  ) {
    super(_accordion, changeDetectorRef, uniqueSelectionDispatcher);
  }

  private _destroy$ = new Subject<void>();

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

  ngOnInit(): void {
    if (!this._accordion) {
      return;
    }
    this.expandedChange.pipe(takeUntil(this._destroy$)).subscribe(expanded => {
      if (expanded) {
        this._accordion.itemExpanded.emit(this.id);
      } else {
        this._accordion.itemCollapsed.emit(this.id);
      }
    });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this._destroy$.next();
    this._destroy$.complete();
  }
}

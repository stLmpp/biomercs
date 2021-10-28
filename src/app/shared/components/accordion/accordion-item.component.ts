import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  Host,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { AccordionItemTitleDirective } from '@shared/components/accordion/accordion-item-title.directive';
import { Animations } from '@shared/animations/animations';
import { UniqueSelectionDispatcher } from '@angular/cdk/collections';
import { Accordion } from '@shared/components/accordion/accordion';
import { Subject, takeUntil } from 'rxjs';
import { FocusableOption } from '@angular/cdk/a11y';
import { Key } from '@model/enum/key';

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
export class AccordionItemComponent extends CdkAccordionItem implements OnInit, OnDestroy, FocusableOption {
  constructor(
    @Host() @Optional() private _accordion: Accordion,
    changeDetectorRef: ChangeDetectorRef,
    uniqueSelectionDispatcher: UniqueSelectionDispatcher
  ) {
    super(_accordion, changeDetectorRef, uniqueSelectionDispatcher);
  }

  private readonly _destroy$ = new Subject<void>();

  @Input() accordionTitle?: string;

  @ContentChildren(AccordionItemTitleDirective)
  readonly accordionItemTitleDirectives!: QueryList<AccordionItemTitleDirective>;
  @ViewChild('header') readonly headerElementRef!: ElementRef<HTMLDivElement>;

  @HostBinding('class.expanded')
  get expandedClass(): boolean {
    return this.expanded;
  }

  @HostBinding('class.disabled')
  get disabledClass(): boolean {
    return this.disabled;
  }

  onKeydown($event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    switch ($event.key) {
      case Key.Enter:
      case Key.Space:
        this.toggle();
        break;
    }
    this._accordion?.focusKeyManager?.onKeydown($event);
  }

  focus(): void {
    this.headerElementRef.nativeElement?.focus();
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this._destroy$.next();
    this._destroy$.complete();
  }
}

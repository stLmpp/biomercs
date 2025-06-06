import { AfterContentInit, ContentChildren, Directive, Input, QueryList } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { CardMenuDirective } from '@shared/components/card/card-menu/card-menu.directive';

@Directive({
  selector: 'bio-card-menus,[bioCardMenus]',
  host: { class: 'card-menus' },
})
export class CardMenusDirective implements AfterContentInit {
  private _bioCardMenuFocusOnFirstItem = false;

  @ContentChildren(CardMenuDirective) readonly cardMenuDirectives!: QueryList<CardMenuDirective>;

  @Input()
  set bioCardMenuFocusOnFirstItem(bioCardMenuFocusOnFirstItem: boolean) {
    this._bioCardMenuFocusOnFirstItem = coerceBooleanProperty(bioCardMenuFocusOnFirstItem);
  }

  ngAfterContentInit(): void {
    if (this._bioCardMenuFocusOnFirstItem) {
      this.cardMenuDirectives.first?.focus();
    }
  }

  static ngAcceptInputType_bioCardMenuFocusOnFirstItem: BooleanInput;
}

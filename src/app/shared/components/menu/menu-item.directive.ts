import { Directive, ElementRef, HostBinding, Input, inject } from '@angular/core';
import { MenuComponent } from './menu.component';
import { MenuItem } from './menu-item';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { ButtonComponent } from '../button/button.component';

@Directive({
  selector: '[bioMenuItem]:not([bioButton])',
  host: { class: 'menu-item', tabindex: '0' },
  providers: [{ provide: MenuItem, useExisting: MenuItemDirective }],
})
export class MenuItemDirective extends MenuItem {
  constructor() {
    const menu = inject(MenuComponent, { host: true });
    const elementRef = inject(ElementRef);

    super(menu, elementRef);
    this.menu = menu;
  }

  private _disabled = false;

  override menu: MenuComponent;

  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @HostBinding('attr.disabled')
  get disabledAttr(): boolean | null {
    return this._disabled || null;
  }

  isDisabled(): boolean {
    return this._disabled;
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

@Directive({
  selector: '[bioButton][bioMenuItem]',
  host: { class: 'menu-item' },
  providers: [{ provide: MenuItem, useExisting: MenuItemButtonDirective }],
})
export class MenuItemButtonDirective extends MenuItem {
  private buttonComponent = inject(ButtonComponent, { self: true });

  constructor() {
    const menu = inject(MenuComponent, { host: true });
    const elementRef = inject(ElementRef);

    super(menu, elementRef);
    this.menu = menu;
  }

  override menu: MenuComponent;

  isDisabled(): boolean {
    return this.buttonComponent.disabled;
  }
}

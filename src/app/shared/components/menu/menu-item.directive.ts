import { Directive, ElementRef, forwardRef, Host, HostBinding, Input, Self } from '@angular/core';
import { MenuComponent } from './menu.component';
import { MenuItem } from './menu-item';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { ButtonComponent } from '../button/button.component';

@Directive({
  selector: '[menuItem]:not([bioButton])',
  host: { class: 'menu-item', tabindex: '0' },
  providers: [{ provide: MenuItem, useExisting: forwardRef(() => MenuItemDirective) }],
})
export class MenuItemDirective extends MenuItem {
  constructor(@Host() menu: MenuComponent, elementRef: ElementRef) {
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
  selector: '[bioButton][menuItem]',
  host: { class: 'menu-item' },
  providers: [{ provide: MenuItem, useExisting: forwardRef(() => MenuItemButtonDirective) }],
})
export class MenuItemButtonDirective extends MenuItem {
  constructor(@Host() menu: MenuComponent, elementRef: ElementRef, @Self() private buttonComponent: ButtonComponent) {
    super(menu, elementRef);
    this.menu = menu;
  }

  override menu: MenuComponent;

  isDisabled(): boolean {
    return this.buttonComponent.disabled;
  }
}

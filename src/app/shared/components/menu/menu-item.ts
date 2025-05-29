import { FocusableOption } from '@angular/cdk/a11y';
import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { Menu } from './menu';

@Directive()
export abstract class MenuItem implements FocusableOption {
  menu = inject(Menu);
  elementRef = inject(ElementRef);


  @HostListener('click')
  onClick(): void {
    this.menu.close();
  }

  @HostListener('keydown.enter')
  onKeydownEnter(): void {
    this.menu.close();
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  abstract isDisabled(): boolean;
}

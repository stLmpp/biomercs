import { Directive, ElementRef } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

@Directive({
    selector: 'bio-card-menu,[bioCardMenu]',
    host: { class: 'card-menu', '[attr.tab-index]': `'0'` },
    standalone: false
})
export class CardMenuDirective implements FocusableOption {
  constructor(private elementRef: ElementRef<HTMLElement>) {}

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}

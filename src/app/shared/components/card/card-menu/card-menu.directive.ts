import { Directive, ElementRef, inject } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';

@Directive({
  selector: 'bio-card-menu,[bioCardMenu]',
  host: { class: 'card-menu', '[attr.tab-index]': `'0'` },
})
export class CardMenuDirective implements FocusableOption {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}

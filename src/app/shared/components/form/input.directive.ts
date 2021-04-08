import { Directive, ElementRef, HostBinding, Input, Optional, Self } from '@angular/core';
import { AbstractComponent } from '../core/abstract-component';
import { ControlDirective } from '@stlmpp/control';
import { FocusableOption } from '@angular/cdk/a11y';

@Directive({
  selector: 'input[bioInput]:not([type=checkbox]):not([type=radio]),textarea[bioInput]',
  host: { class: 'input' },
  exportAs: 'bio-input',
})
export class InputDirective extends AbstractComponent implements FocusableOption {
  constructor(
    private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    @Optional() @Self() public controlDirective?: ControlDirective
  ) {
    super();
  }

  @Input() @HostBinding('attr.id') id?: number | string;

  get primaryClass(): boolean {
    return !this.dangerClass && (this.bioType || 'primary') === 'primary';
  }

  get dangerClass(): boolean {
    return this.bioType === 'danger' || !!(this.controlDirective?.isTouched && this.controlDirective.isInvalid);
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}

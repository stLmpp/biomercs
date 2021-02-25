import { Directive, HostBinding, Input, Optional, Self } from '@angular/core';
import { AbstractComponent } from '../core/abstract-component';
import { ControlDirective } from '@stlmpp/control';

@Directive({
  selector: 'input[bioInput]:not([type=checkbox]):not([type=radio]),textarea[bioInput]',
  host: { class: 'input' },
})
export class InputDirective extends AbstractComponent {
  constructor(@Optional() @Self() public controlDirective?: ControlDirective) {
    super();
  }

  @Input() @HostBinding('attr.id') id?: number | string;

  get primaryClass(): boolean {
    return !this.dangerClass && (this.bioType || 'primary') === 'primary';
  }

  get dangerClass(): boolean {
    return this.bioType === 'danger' || !!(this.controlDirective?.isTouched && this.controlDirective.isInvalid);
  }
}

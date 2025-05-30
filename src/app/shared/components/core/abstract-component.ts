import { Directive, HostBinding, Input, input, model } from '@angular/core';
import { BioSizeInput } from './types';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { AbstractColorComponent } from '@shared/components/core/abstract-color-component';

@Directive()
export abstract class AbstractComponent extends AbstractColorComponent {
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }
  protected _disabled = false;

  readonly bioSize = model<BioSizeInput>();

  @HostBinding('class.disabled')
  get disabledClass(): boolean | null {
    return this._disabled || null;
  }

  @HostBinding('attr.aria-disabled')
  get ariaDisabled(): string {
    return '' + this._disabled;
  }

  @HostBinding('class.small')
  get smallClass(): boolean {
    return this.bioSize() === 'small';
  }

  @HostBinding('class.medium')
  get mediumClass(): boolean {
    return this.bioSize() === 'medium';
  }

  @HostBinding('class.large')
  get largeClass(): boolean {
    return this.bioSize() === 'large';
  }

  @Input() set small(small: BooleanInput) {
    if (coerceBooleanProperty(small)) {
      this.bioSize.set('small');
    }
  }

  @Input() set medium(medium: BooleanInput) {
    if (coerceBooleanProperty(medium)) {
      this.bioSize.set('medium');
    }
  }

  @Input() set large(large: BooleanInput) {
    if (coerceBooleanProperty(large)) {
      this.bioSize.set('large');
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

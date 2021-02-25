import { Directive, HostBinding, Input } from '@angular/core';
import { BioSizeInput, BioTypeInput } from './types';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Destroyable } from '../common/destroyable-component';

@Directive()
export abstract class AbstractComponent extends Destroyable {
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }
  private _disabled = false;

  @Input() bioType: BioTypeInput;
  @Input() bioSize: BioSizeInput;

  @HostBinding('class.primary') get primaryClass(): boolean {
    return this.bioType === 'primary';
  }

  @HostBinding('class.accent') get accentClass(): boolean {
    return this.bioType === 'accent';
  }

  @HostBinding('class.danger') get dangerClass(): boolean {
    return this.bioType === 'danger';
  }

  @Input() set primary(primary: BooleanInput) {
    if (coerceBooleanProperty(primary)) {
      this.bioType = 'primary';
    }
  }

  @Input() set accent(accent: BooleanInput) {
    if (coerceBooleanProperty(accent)) {
      this.bioType = 'accent';
    }
  }

  @Input() set danger(danger: BooleanInput) {
    if (coerceBooleanProperty(danger)) {
      this.bioType = 'danger';
    }
  }

  @HostBinding('class.disabled')
  get disabledClass(): boolean | null {
    return this._disabled || null;
  }

  @HostBinding('attr.aria-disabled') get ariaDisabled(): string {
    return '' + this._disabled;
  }

  @HostBinding('class.small') get smallClass(): boolean {
    return this.bioSize === 'small';
  }

  @HostBinding('class.medium') get mediumClass(): boolean {
    return this.bioSize === 'medium';
  }

  @HostBinding('class.large') get largeClass(): boolean {
    return this.bioSize === 'large';
  }

  @Input() set small(small: BooleanInput) {
    if (coerceBooleanProperty(small)) {
      this.bioSize = 'small';
    }
  }

  @Input() set medium(medium: BooleanInput) {
    if (coerceBooleanProperty(medium)) {
      this.bioSize = 'medium';
    }
  }

  @Input() set large(large: BooleanInput) {
    if (coerceBooleanProperty(large)) {
      this.bioSize = 'large';
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

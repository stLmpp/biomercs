import { Directive, HostBinding, Input } from '@angular/core';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { BioTypeInput } from '@shared/components/core/types';

@Directive()
export abstract class AbstractColorComponent extends Destroyable {
  @Input() bioType: BioTypeInput;

  @HostBinding('class.primary')
  get primaryClass(): boolean {
    return this.bioType === 'primary';
  }

  @HostBinding('class.accent')
  get accentClass(): boolean {
    return this.bioType === 'accent';
  }

  @HostBinding('class.danger')
  get dangerClass(): boolean {
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
}

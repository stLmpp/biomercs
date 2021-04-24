import { Directive, HostBinding, Input } from '@angular/core';
import { BioTypeInput } from '@shared/components/core/types';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive()
export class BadgeBase {
  @Input() bioType: BioTypeInput = 'accent';

  @HostBinding('class.badge-primary')
  get primaryClass(): boolean {
    return this.bioType === 'primary';
  }

  @HostBinding('class.badge-accent')
  get accentClass(): boolean {
    return this.bioType === 'accent';
  }

  @HostBinding('class.badge-danger')
  get dangerClass(): boolean {
    return this.bioType === 'danger';
  }

  @Input()
  set primary(primary: BooleanInput) {
    if (coerceBooleanProperty(primary)) {
      this.bioType = 'primary';
    }
  }

  @Input()
  set accent(accent: BooleanInput) {
    if (coerceBooleanProperty(accent)) {
      this.bioType = 'accent';
    }
  }

  @Input()
  set danger(danger: BooleanInput) {
    if (coerceBooleanProperty(danger)) {
      this.bioType = 'danger';
    }
  }
}

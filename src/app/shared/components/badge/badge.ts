import { Directive, HostBinding, Input, inject, model } from '@angular/core';
import { BioTypeInput } from '@shared/components/core/types';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';

@Directive()
export class BadgeBase {
  private bioBadgeConfig = inject(BioBadgeConfig, { optional: true });

  readonly bioType = model<BioTypeInput>(this.bioBadgeConfig?.bioType ?? 'accent');

  @HostBinding('class.badge-primary')
  get primaryClass(): boolean {
    return this.bioType() === 'primary';
  }

  @HostBinding('class.badge-accent')
  get accentClass(): boolean {
    return this.bioType() === 'accent';
  }

  @HostBinding('class.badge-danger')
  get dangerClass(): boolean {
    return this.bioType() === 'danger';
  }

  @Input()
  set primary(primary: BooleanInput) {
    if (coerceBooleanProperty(primary)) {
      this.bioType.set('primary');
    }
  }

  @Input()
  set accent(accent: BooleanInput) {
    if (coerceBooleanProperty(accent)) {
      this.bioType.set('accent');
    }
  }

  @Input()
  set danger(danger: BooleanInput) {
    if (coerceBooleanProperty(danger)) {
      this.bioType.set('danger');
    }
  }
}

export class BioBadgeConfig {
  constructor(config?: Partial<BioBadgeConfig>) {
    Object.assign(this, config);
  }

  bioType: BioTypeInput = 'accent';
}

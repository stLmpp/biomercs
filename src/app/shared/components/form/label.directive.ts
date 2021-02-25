import { Directive, HostBinding, Input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({ selector: 'label' })
export class LabelDirective {
  private _accent = false;
  private _danger = false;

  @Input() @HostBinding('attr.for') for?: string | number;

  @HostBinding('class.danger')
  get danger(): boolean {
    return this._danger;
  }
  set danger(value: boolean) {
    this._danger = coerceBooleanProperty(value);
  }

  @HostBinding('class.accent')
  get accent(): boolean {
    return this._accent;
  }
  set accent(value: boolean) {
    this._accent = coerceBooleanProperty(value);
  }

  static ngAcceptInputType_accent: BooleanInput;
  static ngAcceptInputType_danger: BooleanInput;
}

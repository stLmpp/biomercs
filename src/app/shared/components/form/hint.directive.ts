import { Directive, HostBinding, Input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';

@Directive({
  selector: '[bioHint],bio-hint',
  host: { class: 'hint' },
})
export class FormFieldHintDirective {
  @Input()
  @HostBinding('class.start')
  get start(): boolean {
    return this._start;
  }
  set start(start: boolean) {
    this._start = coerceBooleanProperty(start);
    if (this._start) {
      this._end = false;
    }
  }
  private _start = true;

  @Input()
  @HostBinding('class.end')
  get end(): boolean {
    return this._end;
  }
  set end(end: boolean) {
    this._end = coerceBooleanProperty(end);
    if (this._end) {
      this._start = false;
    }
  }
  private _end = false;

  static ngAcceptInputType_start: BooleanInput;
  static ngAcceptInputType_end: BooleanInput;
}

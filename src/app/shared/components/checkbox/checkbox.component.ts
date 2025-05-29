import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, ViewEncapsulation, inject, input, output } from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { HorizontalPosition } from '@shared/components/common/positions';
import { NgClass } from '@angular/common';

@Component({
  selector: 'bio-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ControlValue, useExisting: CheckboxComponent }],
  host: { class: 'checkbox-container' },
  imports: [NgClass],
})
export class CheckboxComponent extends ControlValue<boolean> {
  private changeDetectorRef = inject(ChangeDetectorRef);


  private _checked = false;
  private _indeterminate = false;
  private _disabled = false;

  @Input()
  get checked(): boolean {
    return this._checked;
  }
  set checked(checked: boolean) {
    this._checked = coerceBooleanProperty(checked);
  }

  @Input()
  get indeterminate(): boolean {
    return this._indeterminate;
  }
  set indeterminate(indeterminate: boolean) {
    this._indeterminate = coerceBooleanProperty(indeterminate);
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  readonly labelPosition = input<HorizontalPosition>('right');
  readonly name = input<string>();

  readonly checkedChange = output<boolean>();

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    $event.stopPropagation();
  }

  setValue(value: boolean): void {
    this._checked = value;
    this.changeDetectorRef.markForCheck();
  }

  onChange($event: Event): void {
    this._checked = ($event.target as HTMLInputElement).checked;
    this.checkedChange.emit(this.checked);
    this.onChange$.next(this.checked);
    this._indeterminate = false;
    this.changeDetectorRef.markForCheck();
  }

  onBlur(): void {
    this.onTouched$.next();
  }

  override setDisabled(disabled: boolean): void {
    this._disabled = disabled;
    this.changeDetectorRef.markForCheck();
  }

  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_indeterminate: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
}

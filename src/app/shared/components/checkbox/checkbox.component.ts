import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewEncapsulation,
  EventEmitter,
  ChangeDetectorRef,
  HostListener,
} from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { HorizontalPosistion } from '@shared/components/common/positions';

@Component({
  selector: 'bio-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: ControlValue, useExisting: CheckboxComponent }],
  host: { class: 'checkbox-container' },
})
export class CheckboxComponent extends ControlValue<boolean> {
  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

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

  @Input() labelPosition: HorizontalPosistion = 'right';
  @Input() name?: string;

  @Output() readonly checkedChange = new EventEmitter<boolean>();

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

  setDisabled(disabled: boolean): void {
    this._disabled = disabled;
    this.changeDetectorRef.markForCheck();
  }

  static ngAcceptInputType_checked: BooleanInput;
  static ngAcceptInputType_indeterminate: BooleanInput;
  static ngAcceptInputType_disabled: BooleanInput;
}

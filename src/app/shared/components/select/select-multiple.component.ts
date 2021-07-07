import { AfterContentInit, ChangeDetectionStrategy, Component, forwardRef, ViewEncapsulation } from '@angular/core';
import { SelectComponent } from '@shared/components/select/select.component';
import { Select } from '@shared/components/select/select';
import { ControlValue } from '@stlmpp/control';
import { Animations } from '@shared/animations/animations';
import { auditTime, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'bio-select[multiple]',
  templateUrl: './select-multiple.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'multiple' },
  providers: [
    { provide: Select, useExisting: forwardRef(() => SelectMultipleComponent) },
    { provide: ControlValue, useExisting: forwardRef(() => SelectMultipleComponent), multi: true },
  ],
  animations: [Animations.fade.inOut(100), Animations.scale.in(100, 0.8)],
})
export class SelectMultipleComponent extends SelectComponent implements AfterContentInit {
  override multiple = true;

  override value: any[] = [];

  private _setControlValueNoEmit(valueSelected: any): void {
    const indexSelected = this.value.findIndex(value => this.compareWith(value, valueSelected));
    if (indexSelected !== -1) {
      this.value = this.value.filter((_, index) => indexSelected !== index);
    } else {
      this.value = [...this.value, valueSelected];
    }
  }

  override setControlValue(valueSelected: any): void {
    this._setControlValueNoEmit(valueSelected);
    this.changeDetectorRef.markForCheck();
    this.onChange$.next(this.value);
  }

  override setControlValues(values: any[]): void {
    for (const value of values) {
      this._setControlValueNoEmit(value);
    }
    this.changeDetectorRef.markForCheck();
    this.onChange$.next(this.value);
  }

  override isSelected(): boolean {
    return false;
  }

  override setValue(value: any): void {
    this.value = value;
    this.changeDetectorRef.markForCheck();
  }

  override ngAfterContentInit(): void {
    this.options.changes.pipe(takeUntil(this.destroy$), auditTime(100), startWith(this.options)).subscribe(options => {
      for (const option of options) {
        option.isSelected = this.value.some(value => this.compareWith(value, option.value));
        option.changeDetectorRef.markForCheck();
        option.optgroupComponent?.changeDetectorRef.markForCheck();
      }
    });
  }
}

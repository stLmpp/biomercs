import { NgxCurrencyConfig, NgxCurrencyInputMode, NgxCurrencyDirective } from 'ngx-currency';
import { Directive, ElementRef, Inject, KeyValueDiffers, OnInit, Optional } from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { Subject } from 'rxjs';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';

@Directive({
  selector: 'input[bioCurrencyMask]',
  providers: [{ provide: ControlValue, useExisting: CurrencyMaskDirective, multi: true }],
})
export class CurrencyMaskDirective extends NgxCurrencyDirective implements ControlValue<number>, OnInit {
  constructor(
    elementRef: ElementRef,
    keyValueDiffers: KeyValueDiffers,
    @Optional() @Inject(CURRENCY_MASK_CONFIG) currencyMaskOptions?: Partial<NgxCurrencyConfig>
  ) {
    super(
      {
        align: 'right',
        allowNegative: true,
        allowZero: true,
        decimal: ',',
        precision: 2,
        prefix: '',
        suffix: '',
        thousands: '.',
        nullable: true,
        inputMode: NgxCurrencyInputMode.Financial,
        ...currencyMaskOptions,
      },
      keyValueDiffers,
      elementRef
    );
  }

  readonly onChange$ = new Subject<number>();
  readonly onTouched$ = new Subject<void>();

  setDisabled(disabled: boolean): void {
    this.setDisabledState(disabled);
  }

  setValue(value: number): void {
    this.writeValue(value);
  }

  override registerOnChange(): void {
    super.registerOnChange(value => this.onChange$.next(value || 0));
  }

  override registerOnTouched(): void {
    super.registerOnTouched(() => this.onTouched$.next());
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.registerOnChange();
    this.registerOnTouched();
  }
}

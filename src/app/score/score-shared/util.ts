import { CurrencyMaskConfig, CurrencyMaskInputMode } from 'ngx-currency';

export const scoreCurrencyMask: Partial<CurrencyMaskConfig> = {
  align: 'left',
  allowNegative: false,
  nullable: true,
  allowZero: true,
  inputMode: CurrencyMaskInputMode.NATURAL,
  precision: 0,
};

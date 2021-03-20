import { InjectionToken } from '@angular/core';
import { CurrencyMaskConfig } from 'ngx-currency';

export const CURRENCY_MASK_CONFIG = new InjectionToken<Partial<CurrencyMaskConfig>>('CURRENCY_MASK_OPTIONS');

import { InjectionToken } from '@angular/core';
import { NgxCurrencyConfig } from 'ngx-currency';

export const CURRENCY_MASK_CONFIG = new InjectionToken<Partial<NgxCurrencyConfig>>('CURRENCY_MASK_OPTIONS');

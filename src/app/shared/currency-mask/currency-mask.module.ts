import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyMaskDirective } from './currency-mask.directive';
import { NgxCurrencyConfig } from 'ngx-currency';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';

@NgModule({
  exports: [CurrencyMaskDirective],
  imports: [CommonModule, CurrencyMaskDirective],
})
export class CurrencyMaskModule {
  static forFeature(config?: Partial<NgxCurrencyConfig>): ModuleWithProviders<CurrencyMaskModule> {
    return {
      ngModule: CurrencyMaskModule,
      providers: [
        {
          provide: CURRENCY_MASK_CONFIG,
          useFactory: (parentConfig?: Partial<NgxCurrencyConfig>) => ({ ...parentConfig, ...config }),
          deps: [[new Optional(), CURRENCY_MASK_CONFIG]],
        },
      ],
    };
  }
}

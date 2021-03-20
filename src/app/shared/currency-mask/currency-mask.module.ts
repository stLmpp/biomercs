import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyMaskDirective } from './currency-mask.directive';
import { CurrencyMaskConfig } from 'ngx-currency';
import { CURRENCY_MASK_CONFIG } from '@shared/currency-mask/currency-mask-config.token';

@NgModule({
  declarations: [CurrencyMaskDirective],
  exports: [CurrencyMaskDirective],
  imports: [CommonModule],
})
export class CurrencyMaskModule {
  static forRoot(config?: Partial<CurrencyMaskConfig>): ModuleWithProviders<CurrencyMaskModule> {
    return {
      ngModule: CurrencyMaskModule,
      providers: [{ provide: CURRENCY_MASK_CONFIG, useValue: config ?? {} }],
    };
  }

  static forChild(config?: Partial<CurrencyMaskConfig>): ModuleWithProviders<CurrencyMaskModule> {
    return {
      ngModule: CurrencyMaskModule,
      providers: [
        {
          provide: CURRENCY_MASK_CONFIG,
          useFactory: (parentConfig?: Partial<CurrencyMaskConfig>) => ({ ...parentConfig, ...config }),
          deps: [[new Optional(), CURRENCY_MASK_CONFIG]],
        },
      ],
    };
  }
}

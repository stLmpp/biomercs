import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskDirective } from './mask.directive';
import { MASK_CONFIG } from '@shared/mask/mask-config.token';
import { IConfig } from 'ngx-mask';

@NgModule({
  imports: [CommonModule, MaskDirective],
  exports: [MaskDirective],
})
export class MaskModule {
  static forFeature(config?: Partial<IConfig>): ModuleWithProviders<MaskModule> {
    return {
      ngModule: MaskModule,
      providers: [
        {
          provide: MASK_CONFIG,
          useFactory: (parentConfig?: Partial<IConfig>) => ({ ...parentConfig, ...config }),
          deps: [[new SkipSelf(), new Optional(), MASK_CONFIG]],
        },
      ],
    };
  }
}

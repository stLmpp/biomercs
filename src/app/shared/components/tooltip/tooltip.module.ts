import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipDirective } from './tooltip.directive';
import { DEFAULT_TOOLTIP_CONFIG, TOOLTIP_DEFAULT_CONFIG, TooltipConfig } from './tooltip-token';

@NgModule({
  declarations: [TooltipComponent, TooltipDirective],
  exports: [TooltipComponent, TooltipDirective],
  imports: [CommonModule],
})
export class TooltipModule {
  static forRoot(config?: Partial<TooltipConfig>): ModuleWithProviders<TooltipModule> {
    return {
      ngModule: TooltipModule,
      providers: [{ provide: TOOLTIP_DEFAULT_CONFIG, useValue: { ...DEFAULT_TOOLTIP_CONFIG, ...config } }],
    };
  }

  static forChild(config?: Partial<TooltipConfig>): ModuleWithProviders<TooltipModule> {
    return {
      ngModule: TooltipModule,
      providers: [
        {
          provide: TOOLTIP_DEFAULT_CONFIG,
          useFactory: (parentConfig?: TooltipConfig) => ({ ...DEFAULT_TOOLTIP_CONFIG, ...parentConfig, ...config }),
          deps: [[new SkipSelf(), new Optional(), TOOLTIP_DEFAULT_CONFIG]],
        },
      ],
    };
  }
}

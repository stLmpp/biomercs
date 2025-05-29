import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackBarComponent } from './snack-bar.component';
import { SNACK_BAR_DEFAULT_CONFIG, SnackBarConfig } from './snack-bar.config';
import { ButtonModule } from '../button/button.module';
import { OverlayModule } from '@angular/cdk/overlay';

const DECLARATIONS = [SnackBarComponent];
const MODULES = [CommonModule, ButtonModule, OverlayModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class SnackBarModule {
  static forFeature(config?: SnackBarConfig): ModuleWithProviders<SnackBarModule> {
    return {
      ngModule: SnackBarModule,
      providers: [
        {
          provide: SNACK_BAR_DEFAULT_CONFIG,
          useFactory: (parentConfig?: SnackBarConfig) => new SnackBarConfig({ ...parentConfig, ...config }),
          deps: [[new Optional(), SNACK_BAR_DEFAULT_CONFIG]],
        },
      ],
    };
  }
}

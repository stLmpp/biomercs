import { ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SnackBarComponent } from './snack-bar.component';
import { SnackBarService } from './snack-bar.service';
import { SNACK_BAR_DEFAULT_CONFIG, SnackBarConfig } from './snack-bar.config';
import { ButtonModule } from '../button/button.module';

@NgModule({
  declarations: [SnackBarComponent],
  imports: [CommonModule, ButtonModule],
  exports: [SnackBarComponent],
})
export class SnackBarModule {
  static forRoot(config?: SnackBarConfig): ModuleWithProviders<SnackBarModule> {
    return {
      ngModule: SnackBarModule,
      providers: [SnackBarService, { provide: SNACK_BAR_DEFAULT_CONFIG, useValue: config ?? new SnackBarConfig() }],
    };
  }

  static forChild(config?: SnackBarConfig): ModuleWithProviders<SnackBarModule> {
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

import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeDirective } from './badge.directive';
import { BadgeComponent } from './badge.component';
import { BioBadgeConfig } from '@shared/components/badge/badge';

const DECLARATIONS = [BadgeDirective, BadgeComponent];
const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class BadgeModule {
  static forFeature(config?: Partial<BioBadgeConfig>): ModuleWithProviders<BadgeModule> {
    return {
      ngModule: BadgeModule,
      providers: [{ provide: BioBadgeConfig, useValue: new BioBadgeConfig(config) }],
    };
  }
}

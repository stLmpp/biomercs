import { InjectionToken } from '@angular/core';

export interface TooltipConfig {
  delay: number;
  showDelay: number;
  hideDelay: number;
}

export const DEFAULT_TOOLTIP_CONFIG: TooltipConfig = {
  delay: 0,
  hideDelay: 0,
  showDelay: 0,
};

export const TOOLTIP_DEFAULT_CONFIG = new InjectionToken<TooltipConfig>('TOOLTIP_DEFAULT_CONFIG');

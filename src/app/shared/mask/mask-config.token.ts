import { InjectionToken } from '@angular/core';
import { NgxMaskConfig } from 'ngx-mask';

export const MASK_CONFIG = new InjectionToken<Partial<NgxMaskConfig>>('MASK_CONFIG');

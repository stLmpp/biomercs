import { InjectionToken } from '@angular/core';
import { IConfig } from 'ngx-mask';

export const MASK_CONFIG = new InjectionToken<Partial<IConfig>>('MASK_CONFIG');

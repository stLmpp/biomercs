import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PlatformService } from './platform.service';
import { Platform } from '@model/platform';

export function platformResolver(): ResolveFn<Platform[]> {
  return () => inject(PlatformService).findAll();
}

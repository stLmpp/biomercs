import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Platform } from '@model/platform';
import { PlatformService } from '@shared/services/platform/platform.service';

export function platformApprovalResolver(): ResolveFn<Platform[]> {
  return () => inject(PlatformService).findApproval();
}

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { RegionService } from './region.service';
import { Region } from '@model/region';

export function regionResolver(): ResolveFn<Region[]> {
  return () => inject(RegionService).get();
}

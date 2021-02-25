import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RegionService } from './region.service';
import { Observable } from 'rxjs';
import { Region } from '@model/region';

@Injectable({ providedIn: 'root' })
export class RegionResolver implements Resolve<Region[]> {
  constructor(private regionService: RegionService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Region[]> | Promise<Region[]> | Region[] {
    return this.regionService.get();
  }
}

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PlatformService } from './platform.service';
import { Observable } from 'rxjs';
import { Platform } from '@model/platform';

@Injectable({ providedIn: 'root' })
export class PlatformResolver {
  private platformService = inject(PlatformService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Platform[]> | Promise<Platform[]> | Platform[] {
    return this.platformService.findAll();
  }
}

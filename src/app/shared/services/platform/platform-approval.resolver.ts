import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@model/platform';
import { PlatformService } from '@shared/services/platform/platform.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PlatformApprovalResolver  {
  constructor(private platformService: PlatformService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Platform[]> | Promise<Platform[]> | Platform[] {
    return this.platformService.findApproval();
  }
}

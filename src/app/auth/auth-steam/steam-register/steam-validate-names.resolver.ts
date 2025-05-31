import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthSteamValidateNames } from '@model/auth';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class SteamValidateNamesResolver {
  private authService = inject(AuthService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<AuthSteamValidateNames> | Promise<AuthSteamValidateNames> | AuthSteamValidateNames {
    const steamid = route.paramMap.get(RouteParamEnum.steamid) ?? '';
    return this.authService.validateSteamNames(steamid);
  }
}

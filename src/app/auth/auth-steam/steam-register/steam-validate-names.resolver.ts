import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { AuthSteamValidateNames } from '@model/auth';
import { AuthService } from '../../auth.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class SteamValidateNamesResolver implements Resolve<AuthSteamValidateNames> {
  constructor(private authService: AuthService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<AuthSteamValidateNames> | Promise<AuthSteamValidateNames> | AuthSteamValidateNames {
    const steamid = route.paramMap.get(RouteParamEnum.steamid) ?? '';
    return this.authService.validateSteamNames(steamid);
  }
}

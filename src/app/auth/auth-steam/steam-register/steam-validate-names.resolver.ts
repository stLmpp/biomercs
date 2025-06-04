import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AuthSteamValidateNames } from '@model/auth';
import { AuthService } from '../../auth.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function steamValidateNamesResolver(): ResolveFn<AuthSteamValidateNames> {
  return route => {
    const steamid = route.paramMap.get(RouteParamEnum.steamid) ?? '';
    return inject(AuthService).validateSteamNames(steamid);
  };
}

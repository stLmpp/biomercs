import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../../auth.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function steamRegisterGuard(): CanActivateFn {
  return route => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const urlTree = router.createUrlTree(['/']);
    const steamid = route.paramMap.get(RouteParamEnum.steamid);
    if (!steamid) {
      return urlTree;
    }
    const tupleToken = authService.getSteamToken(steamid);
    if (!tupleToken) {
      return urlTree;
    }
    return authService.validateTokenRegisterSteam(steamid, tupleToken[0]).pipe(map(isValid => isValid || urlTree));
  };
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { map } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function changePasswordValidateGuard(): CanActivateFn {
  return route => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const urlTree = router.createUrlTree(['/']);
    const key = route.paramMap.get(RouteParamEnum.key);
    if (!key) {
      return urlTree;
    }
    return authService.changePasswordValidate(key).pipe(map(isValid => isValid || urlTree));
  };
}

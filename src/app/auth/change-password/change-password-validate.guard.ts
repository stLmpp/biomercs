import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth.service';
import { map, Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class ChangePasswordValidateGuard  {
  private authService = inject(AuthService);
  private router = inject(Router);


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const urlTree = this.router.createUrlTree(['/']);
    const key = route.paramMap.get(RouteParamEnum.key);
    if (!key) {
      return urlTree;
    }
    return this.authService.changePasswordValidate(key).pipe(map(isValid => isValid || urlTree));
  }
}

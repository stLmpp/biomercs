import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  UrlSegment,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './auth.query';

@Injectable({ providedIn: 'root' })
export class AuthLoggedGuard implements CanActivate, CanLoad {
  constructor(private authQuery: AuthQuery) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authQuery.getIsLogged();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authQuery.getIsLogged();
  }
}

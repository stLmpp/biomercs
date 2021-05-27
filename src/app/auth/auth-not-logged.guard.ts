import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanLoad,
  UrlSegment,
  Route,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './auth.query';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthNotLoggedGuard implements CanActivate, CanLoad {
  constructor(private authQuery: AuthQuery, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authQuery.isLogged$.pipe(map(isLogged => !isLogged || this.router.createUrlTree(['/'])));
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authQuery.isLogged$.pipe(map(isLogged => !isLogged || this.router.createUrlTree(['/'])));
  }
}

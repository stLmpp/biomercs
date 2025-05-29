import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, UrlSegment, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './auth.query';

@Injectable({ providedIn: 'root' })
export class AuthLoggedGuard  {
  constructor(private authQuery: AuthQuery, private router: Router) {}

  private _validateIsLogged(): boolean | UrlTree {
    return this.authQuery.getIsLogged() || this.router.createUrlTree(['/auth/login']);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._validateIsLogged();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._validateIsLogged();
  }
}

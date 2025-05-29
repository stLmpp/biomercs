import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './auth.query';

@Injectable({ providedIn: 'root' })
export class AuthNotLoggedGuard  {
  constructor(private authQuery: AuthQuery, private router: Router) {}

  private _validateIsNotLogged(): boolean | UrlTree {
    return !this.authQuery.getIsLogged() || this.router.createUrlTree(['/']);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._validateIsNotLogged();
  }

  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._validateIsNotLogged();
  }
}

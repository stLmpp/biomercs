import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthQuery } from './auth.query';

@Injectable({ providedIn: 'root' })
export class AuthAdminGuard implements CanActivate, CanLoad {
  constructor(private authQuery: AuthQuery, private router: Router) {}

  private _validateAdmin(): boolean | UrlTree {
    return this.authQuery.getIsAdmin() || this.router.createUrlTree(['/']);
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._validateAdmin();
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._validateAdmin();
  }
}

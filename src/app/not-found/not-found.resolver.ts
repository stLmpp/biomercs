import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { compareTwoStrings } from 'string-similarity';
import { AuthQuery } from '../auth/auth.query';

export type PossiblePathType = 'logged' | 'not-logged' | 'both';

export interface PossiblePath {
  path: string;
  title: string;
  type: PossiblePathType;
}

@Injectable({ providedIn: 'root' })
export class NotFoundResolver implements Resolve<PossiblePath[]> {
  constructor(private authQuery: AuthQuery) {}

  possibleRoutes: PossiblePath[] = [
    { path: '/auth/login', title: 'Login', type: 'not-logged' },
    { path: '/auth/register', title: 'Register', type: 'not-logged' },
    { path: '/contact', title: 'Contact', type: 'both' },
    { path: '/score/add', title: 'Submit score', type: 'logged' },
    { path: '/score/leaderboards', title: 'Leaderboards', type: 'logged' },
    { path: '/score/search', title: 'Search scores', type: 'logged' },
    { path: '/score/world-records', title: 'World records', type: 'logged' },
    { path: '/rules', title: 'Rules', type: 'both' },
    { path: '/faq', title: 'FAQ', type: 'both' },
  ];

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PossiblePath[] {
    const isLogged = this.authQuery.getIsLogged();
    const limitPossibleRoutesBasedAuth = (possibleRoute: PossiblePath): boolean =>
      (possibleRoute.type === 'logged' && isLogged) ||
      (possibleRoute.type === 'not-logged' && !isLogged) ||
      possibleRoute.type === 'both';
    return this.possibleRoutes.filter(
      possibleRoute =>
        limitPossibleRoutesBasedAuth(possibleRoute) && compareTwoStrings(state.url, possibleRoute.path) > 0.7
    );
  }
}

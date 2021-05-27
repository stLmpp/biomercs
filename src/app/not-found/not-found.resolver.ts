import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { compareTwoStrings } from 'string-similarity';

export interface PossiblePath {
  path: string;
  title: string;
}

@Injectable({ providedIn: 'root' })
export class NotFoundResolver implements Resolve<PossiblePath[]> {
  possibleRoutes: PossiblePath[] = [
    { path: '/auth/login', title: 'Login' },
    { path: '/auth/register', title: 'Register' },
    { path: '/contact', title: 'Contact' },
    { path: '/score/add', title: 'Submit score' },
    { path: '/score/leaderboards', title: 'Leaderboards' },
    { path: '/score/search', title: 'Search scores' },
    { path: '/score/world-records', title: 'World records' },
    { path: '/rules', title: 'Rules' },
    { path: '/faq', title: 'FAQ' },
  ];

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PossiblePath[] {
    return this.possibleRoutes.filter(possibleRoute => compareTwoStrings(state.url, possibleRoute.path) > 0.7);
  }
}

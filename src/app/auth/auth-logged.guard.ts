import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthQuery } from './auth.query';

export function authLoggedGuard(): CanMatchFn {
  return () => {
    const authQuery = inject(AuthQuery);
    const router = inject(Router);
    return authQuery.getIsLogged() || router.createUrlTree(['/auth/login']);
  };
}

import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Type } from '@angular/core';

export interface TitleResolver {
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<string | null | undefined> | Promise<string | null | undefined> | string | null | undefined;
}

export type TitleType = Type<TitleResolver> | string | null | undefined;

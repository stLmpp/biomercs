import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

export interface TitleResolver {
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<string | null | undefined> | Promise<string | null | undefined> | string | null | undefined;
}

export type TitleType = TitleResolver | string | null | undefined;

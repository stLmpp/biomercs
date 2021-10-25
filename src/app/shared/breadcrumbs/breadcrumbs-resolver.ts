import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

export interface BreadcrumbsResolver {
  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): string | BreadcrumbsItem | Observable<BreadcrumbsItem>;
}

import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

export interface BreadcrumbResolver {
  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): string | BreadcrumbsItem | Observable<BreadcrumbsItem>;
}

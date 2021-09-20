import { BreadcrumbResolver } from '@shared/breadcrumbs/breadcrumb-resolver';
import { Injectable } from '@angular/core';
import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class ForumBreadcrumbsResolver implements BreadcrumbResolver {
  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): string | BreadcrumbsItem | Observable<BreadcrumbsItem> {
    return 'Forum';
  }
}

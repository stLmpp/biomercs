import { Type } from '@angular/core';
import { BreadcrumbResolver } from '@shared/breadcrumbs/breadcrumb-resolver';
import { ActivatedRouteSnapshot } from '@angular/router';

export interface BreadcrumbsItem {
  name: string;
  path: string;
}

export interface BreadcrumbsItemInternal {
  activatedRouteSnapshot: ActivatedRouteSnapshot;
  resolver: string | BreadcrumbsItem | Type<BreadcrumbResolver>;
}

import { Type } from '@angular/core';
import { BreadcrumbsResolver } from '@shared/breadcrumbs/breadcrumbs-resolver';
import { ActivatedRouteSnapshot, Params, QueryParamsHandling } from '@angular/router';

export interface BreadcrumbsItem {
  name: string;
  path: string;
  queryParamsHandling?: QueryParamsHandling | null;
  queryParams?: Params | null;
  preserveFragment?: boolean;
}

export interface BreadcrumbsItemInternal {
  activatedRouteSnapshot: ActivatedRouteSnapshot;
  resolver: BreadcrumbsData;
}

export type BreadcrumbsData = string | BreadcrumbsItem | Type<BreadcrumbsResolver>;

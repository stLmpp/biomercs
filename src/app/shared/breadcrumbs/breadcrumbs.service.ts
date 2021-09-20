import { Injectable, Injector } from '@angular/core';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbsItem, BreadcrumbsItemInternal } from '@shared/breadcrumbs/breadcrumbs';
import { BreadcrumbResolver } from '@shared/breadcrumbs/breadcrumb-resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { isFunction } from 'st-utils';
import { forkJoin, isObservable, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
  constructor(
    private globalListenersService: GlobalListenersService,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) {}

  readonly breadcrumbs$ = this.globalListenersService.routerActivationEnd$.pipe(
    shareReplay(),
    tap(console.log),
    switchMap(() => this._getBreadcrumbsFromRoute())
  );

  private _getBreadcrumbsFromRoute(): Observable<BreadcrumbsItem[]> {
    const breadcrumbsResolvers: BreadcrumbsItemInternal[] = [];
    let state = this.activatedRoute.snapshot.root;
    if (state.data[RouteDataEnum.breadcrumbs]) {
      breadcrumbsResolvers.push({ resolver: state.data[RouteDataEnum.breadcrumbs], activatedRouteSnapshot: state });
    }
    while (state.firstChild) {
      state = state.firstChild;
      const breadcrumbResolver = state.data[RouteDataEnum.breadcrumbs];
      if (breadcrumbResolver) {
        breadcrumbsResolvers.push({ resolver: breadcrumbResolver, activatedRouteSnapshot: state });
      }
    }
    const breadcrumbs$: Observable<BreadcrumbsItem>[] = [];
    for (const breadcrumbResolver of breadcrumbsResolvers) {
      if (isFunction(breadcrumbResolver.resolver)) {
        const resolver: BreadcrumbResolver = this.injector.get(breadcrumbResolver.resolver);
        console.log(resolver);
        breadcrumbs$.push(this._resolveBreadcrumb(state, resolver));
      }
    }
    return forkJoin(breadcrumbs$);
  }

  private _resolveBreadcrumb(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    resolver: BreadcrumbResolver
  ): Observable<BreadcrumbsItem> {
    const response = resolver.resolve(activatedRouteSnapshot);
    if (isObservable(response)) {
      return response.pipe(map(breadcrumb => this._mapBreadcrumb(activatedRouteSnapshot, breadcrumb)));
    } else {
      return of(this._mapBreadcrumb(activatedRouteSnapshot, response));
    }
  }

  private _mapBreadcrumb(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    item: BreadcrumbsItem | string
  ): BreadcrumbsItem {
    return {} as any;
  }
}

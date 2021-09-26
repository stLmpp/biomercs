import { Injectable, Injector, Type } from '@angular/core';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbsData, BreadcrumbsItem, BreadcrumbsItemInternal } from '@shared/breadcrumbs/breadcrumbs';
import { BreadcrumbResolver } from '@shared/breadcrumbs/breadcrumb-resolver';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { isFunction, isObject } from 'st-utils';
import { auditTime, forkJoin, isObservable, map, Observable, of, ReplaySubject, Subscription, switchMap } from 'rxjs';

function isBreadcrumbsResolver(resolver: any): resolver is Type<BreadcrumbResolver> {
  return isFunction(resolver);
}

@Injectable({ providedIn: 'root' })
export class BreadcrumbsService {
  constructor(
    private globalListenersService: GlobalListenersService,
    private activatedRoute: ActivatedRoute,
    private injector: Injector
  ) {}

  private readonly _breadcrumbs$ = new ReplaySubject<BreadcrumbsItem[]>();

  private _breadcrumbsSubscription = Subscription.EMPTY;

  readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

  private _getBreadcrumbsFromRoute(): Observable<BreadcrumbsItem[]> {
    const breadcrumbsResolverMap = new Map<BreadcrumbsData, BreadcrumbsItemInternal>();
    let state = this.activatedRoute.snapshot.root;
    if (state.data[RouteDataEnum.breadcrumbs]) {
      breadcrumbsResolverMap.set(state.data[RouteDataEnum.breadcrumbs], {
        resolver: state.data[RouteDataEnum.breadcrumbs],
        activatedRouteSnapshot: state,
      });
    }
    while (state.firstChild) {
      state = state.firstChild;
      const breadcrumbResolver = state.data[RouteDataEnum.breadcrumbs];
      if (breadcrumbResolver && !breadcrumbsResolverMap.has(breadcrumbResolver)) {
        breadcrumbsResolverMap.set(breadcrumbResolver, { resolver: breadcrumbResolver, activatedRouteSnapshot: state });
      }
    }
    const breadcrumbs$: Observable<BreadcrumbsItem>[] = [];
    for (const [, breadcrumbResolver] of breadcrumbsResolverMap) {
      if (isBreadcrumbsResolver(breadcrumbResolver.resolver)) {
        const resolver: BreadcrumbResolver = this.injector.get(breadcrumbResolver.resolver);
        breadcrumbs$.push(this._resolveBreadcrumbs(state, resolver));
      } else {
        breadcrumbs$.push(
          of(this._mapBreadcrumbs(breadcrumbResolver.activatedRouteSnapshot, breadcrumbResolver.resolver))
        );
      }
    }
    return forkJoin(breadcrumbs$);
  }

  private _resolveBreadcrumbs(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    resolver: BreadcrumbResolver
  ): Observable<BreadcrumbsItem> {
    const response = resolver.resolve(activatedRouteSnapshot);
    if (isObservable(response)) {
      return response.pipe(map(breadcrumbs => this._mapBreadcrumbs(activatedRouteSnapshot, breadcrumbs)));
    } else {
      return of(this._mapBreadcrumbs(activatedRouteSnapshot, response));
    }
  }

  private _mapBreadcrumbs(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    item: BreadcrumbsItem | string
  ): BreadcrumbsItem {
    const itemObject = isObject(item) ? item : { name: item };
    return {
      queryParamsHandling: 'merge',
      preserveFragment: false,
      queryParams: null,
      ...itemObject,
      path: this._getPathFromActivatedRouteSnapshot(activatedRouteSnapshot),
    };
  }

  private _getPathFromActivatedRouteSnapshot(activatedRouteSnapshot: ActivatedRouteSnapshot): string {
    const pathFromRoot = activatedRouteSnapshot.pathFromRoot;
    let path = '';
    for (const activatedRouteSnapshotPath of pathFromRoot) {
      if (activatedRouteSnapshotPath.url.length) {
        path += '/' + activatedRouteSnapshotPath.url.map(segment => segment.toString()).join('/');
      }
    }
    return path;
  }

  init(): void {
    this._breadcrumbsSubscription = this.globalListenersService.routerActivationEnd$
      .pipe(
        auditTime(100),
        switchMap(() => this._getBreadcrumbsFromRoute())
      )
      .subscribe(breadcrumbs => {
        this._breadcrumbs$.next(breadcrumbs);
      });
  }

  destroy(): void {
    this._breadcrumbsSubscription.unsubscribe();
  }
}

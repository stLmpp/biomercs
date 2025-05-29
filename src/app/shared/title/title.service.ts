import { Injectable, Injector, Type, inject } from '@angular/core';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { distinctUntilChanged, filter, isObservable, shareReplay, switchMap, tap } from 'rxjs';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Title } from '@angular/platform-browser';
import { isFunction } from 'st-utils';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TitleResolver, TitleType } from '@shared/title/title-resolver';
import { filterNil } from '@util/operators/filter';

function isTitleResolver(type: any): type is Type<TitleResolver> {
  return isFunction(type);
}

@Injectable({ providedIn: 'root' })
export class TitleService {
  private globalListenersService = inject(GlobalListenersService);
  private title = inject(Title);
  private injector = inject(Injector);


  readonly title$ = this.globalListenersService.routerActivationEnd$.pipe(
    filter(event => !!event.snapshot.data[RouteDataEnum.title]),
    distinctUntilChanged(({ snapshot: { data: dataA } }, { snapshot: { data: dataB } }) => {
      const titleA = dataA[RouteDataEnum.title];
      const titleB = dataB[RouteDataEnum.title];
      return !isTitleResolver(titleA) && !isTitleResolver(titleB) && titleA === titleB;
    }),
    switchMap(({ snapshot }) => {
      const title: TitleType = snapshot.data[RouteDataEnum.title];
      if (isTitleResolver(title)) {
        const injector = Injector.create({
          parent: this.injector,
          providers: [{ provide: ActivatedRouteSnapshot, useValue: snapshot }],
        });
        const resolver = injector.get(title);
        const resolved = resolver.resolve(snapshot);
        if (isObservable(resolved)) {
          return resolved;
        } else {
          return Promise.resolve(resolved);
        }
      } else {
        return Promise.resolve(title);
      }
    }),
    filterNil(),
    distinctUntilChanged(),
    shareReplay(),
    tap(title => {
      this.title.setTitle('Biomercs - ' + title);
    })
  );
}

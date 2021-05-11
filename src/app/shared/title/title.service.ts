import { Injectable, Injector, Type } from '@angular/core';
import { GlobalListenersService } from '@shared/services/global-listeners/global-listeners.service';
import { Destroyable } from '@shared/components/common/destroyable-component';
import { distinctUntilChanged, filter, switchMap, takeUntil } from 'rxjs/operators';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Title } from '@angular/platform-browser';
import { isFunction } from 'st-utils';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TitleResolver, TitleType } from '@shared/title/title-resolver';
import { of } from 'rxjs';
import { filterNil } from '@shared/operators/filter';

function isType<T>(type: any): type is Type<T> {
  return isFunction(type);
}

@Injectable({ providedIn: 'root' })
export class TitleService extends Destroyable {
  constructor(
    private globalListenersService: GlobalListenersService,
    private title: Title,
    private injector: Injector
  ) {
    super();
  }

  init(): void {
    this.globalListenersService.routerActivationEnd$
      .pipe(
        takeUntil(this.destroy$),
        filter(event => !!event.snapshot.data[RouteDataEnum.title]),
        distinctUntilChanged(
          ({ snapshot: { data: dataA } }, { snapshot: { data: dataB } }) =>
            dataA[RouteDataEnum.title] === dataB[RouteDataEnum.title]
        ),
        switchMap(({ snapshot }) => {
          const title: TitleType = snapshot.data[RouteDataEnum.title];
          if (isType<TitleResolver>(title)) {
            const injector = Injector.create({
              parent: this.injector,
              providers: [{ provide: ActivatedRouteSnapshot, useValue: snapshot }],
            });
            const resolver = injector.get(title);
            return resolver.resolve(snapshot);
          } else {
            return of(title);
          }
        }),
        filterNil(),
        distinctUntilChanged()
      )
      .subscribe(title => {
        this.title.setTitle('Biomercs - ' + title);
      });
  }
}

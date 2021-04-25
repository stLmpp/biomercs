import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '../../../core/window.service';
import { fromEvent, Observable } from 'rxjs';
import { auditTime, map, shareReplay, startWith } from 'rxjs/operators';

export enum MediaQueryEnum {
  xl = '(min-width: 1920px)',
  lg = '(min-width: 1366px)',
  md = '(min-width: 1024px)',
  sm = '(min-width: 599px)',
  xs = '(min-width: 0px)',
}

@Injectable({ providedIn: 'root' })
export class BreakpointObserverService {
  constructor(@Inject(WINDOW) private window: Window) {}

  private _resize$ = fromEvent(this.window, 'resize').pipe(auditTime(300), shareReplay());

  isMobile$ = this.observe([MediaQueryEnum.sm]).pipe(map(isSmallScreen => !isSmallScreen));

  private _getQuery(medias: MediaQueryEnum[], customMedia?: string[]): boolean {
    return [...medias, ...(customMedia ?? [])].some(key => this.window.matchMedia(key).matches);
  }

  observe(medias: MediaQueryEnum[], customMedia?: string[]): Observable<boolean> {
    return this._resize$.pipe(
      map(() => this._getQuery(medias, customMedia)),
      startWith(this._getQuery(medias, customMedia))
    );
  }
}

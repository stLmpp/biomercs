import { Inject, Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { filter, share } from 'rxjs/operators';
import { ActivationEnd, Event, Router } from '@angular/router';
import { WINDOW } from '../../../core/window.service';

function isActivationEnd(event: Event): event is ActivationEnd {
  return event instanceof ActivationEnd;
}

@Injectable({ providedIn: 'root' })
export class GlobalListenersService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    @Inject(WINDOW) private window: Window
  ) {}
  bodyClick$ = fromEvent(this.document.body, 'click').pipe(share());
  htmlClick$ = fromEvent(this.document.documentElement, 'click').pipe(share());
  windowResize$ = fromEvent(this.window, 'resize').pipe(share());

  routerEvents$ = this.router.events;
  routerActivationEnd$ = this.routerEvents$.pipe(filter(isActivationEnd));
}

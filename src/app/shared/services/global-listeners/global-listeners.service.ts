import { Inject, Injectable } from '@angular/core';
import { filter, fromEvent, share } from 'rxjs';
import { DOCUMENT } from '@angular/common';
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
  readonly htmlClick$ = fromEvent(this.document.documentElement, 'click').pipe(share());
  readonly windowResize$ = fromEvent(this.window, 'resize').pipe(share());

  readonly routerEvents$ = this.router.events;
  readonly routerActivationEnd$ = this.routerEvents$.pipe(filter(isActivationEnd));
}

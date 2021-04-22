import { Inject, Injectable } from '@angular/core';
import { fromEvent } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { share } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class GlobalListenersService {
  constructor(@Inject(DOCUMENT) private document: Document) {}
  bodyClick$ = fromEvent(this.document.body, 'click').pipe(share());
}

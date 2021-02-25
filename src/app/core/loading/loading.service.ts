import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _loading$ = new BehaviorSubject(0);
  isLoading$ = this._loading$.asObservable().pipe(
    map(loadings => !!loadings),
    debounceTime(250)
  );

  get loading(): boolean {
    return !!this._loading$.value;
  }

  add(): void {
    this._loading$.next(this._loading$.value + 1);
  }

  remove(): void {
    this._loading$.next(this._loading$.value - 1);
  }
}

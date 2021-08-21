import { mapTo, MonoTypeOperatorFunction, Observable, switchMap } from 'rxjs';

export function refreshMap<T, R>(callback: (data: T) => Observable<R>): MonoTypeOperatorFunction<T> {
  return switchMap(data => callback(data).pipe(mapTo(data)));
}

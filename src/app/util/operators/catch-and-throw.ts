import { isObservable, Observable, OperatorFunction, throwError } from 'rxjs';
import { HttpError } from '@model/http-error';
import { catchError } from 'rxjs/operators';

export const catchAndThrow = <T>(callback: (error: HttpError) => any): OperatorFunction<T, T> =>
  catchError((err: HttpError) => {
    const ret = callback(err);
    if (isObservable(ret)) {
      return ret as Observable<any>;
    } else {
      return throwError(() => err);
    }
  });

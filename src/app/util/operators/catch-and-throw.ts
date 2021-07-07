import { catchError, isObservable, Observable, OperatorFunction, throwError } from 'rxjs';
import { HttpError } from '@model/http-error';

export const catchAndThrow = <T>(callback: (error: HttpError) => any): OperatorFunction<T, T> =>
  catchError((err: HttpError) => {
    const ret = callback(err);
    if (isObservable(ret)) {
      return ret as Observable<any>;
    } else {
      return throwError(() => err);
    }
  });

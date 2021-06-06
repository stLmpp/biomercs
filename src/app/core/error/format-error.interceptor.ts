import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@model/http-error';
import { isObject, isString } from 'st-utils';

@Injectable()
export class FormatErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        let { error } = response;
        if (isString(error)) {
          try {
            error = JSON.parse(error);
          } catch {}
        }
        if (isObject(error)) {
          error = { ...error };
          error.message ??= 'Internal error';
          error.name ??= error.error ?? 'Internal error';
        }
        return throwError(() => error);
      })
    );
  }
}

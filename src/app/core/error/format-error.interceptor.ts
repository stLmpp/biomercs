import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@model/http-error';

@Injectable({ providedIn: 'root' })
export class FormatErrorInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError(({ error }: HttpErrorResponse) => {
        error = { ...error };
        if (!error.message) {
          error.message = 'Internal error';
        }
        if (!error.error) {
          error.error = 'Internal error';
        }
        return throwError(error);
      })
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { delayWhen, retryWhen, scan } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retryWhen(obs =>
        obs.pipe(
          scan((acc, error) => {
            if (error.status === 429 && acc < 2) {
              return acc + 1;
            } else {
              throw error;
            }
          }, 0),
          delayWhen(() => timer(1000))
        )
      )
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HandleErrorService } from './handle-error.service';
import { environment } from '@environment/environment';

@Injectable()
export class HandleErrorDevInterceptor implements HttpInterceptor {
  constructor(private handleErrorService: HandleErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req$ = next.handle(req);
    if (!environment.production) {
      return req$.pipe(this.handleErrorService.handleErrorOperator());
    }
    return req$;
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthQuery } from './auth.query';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  private authQuery = inject(AuthQuery);


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authQuery.getToken();
    const headers = req.headers.append('Authorization', `Bearer ${token}`);
    const reqClone = req.clone({ headers });
    return next.handle(reqClone);
  }
}

import { Injectable } from '@angular/core';
import { HttpContext, HttpContextToken, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';

export const IgnoreErrorContextToken = new HttpContextToken(() => false);
export const ignoreErrorContext = (): HttpContext => new HttpContext().set(IgnoreErrorContextToken, true);

@Injectable({ providedIn: 'root' })
export class AuthErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private dialogService: DialogService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request$ = next.handle(req);
    if (!req.context.get(IgnoreErrorContextToken)) {
      request$ = request$.pipe(
        catchAndThrow(err => {
          switch (err.status) {
            case HttpStatusCode.Forbidden:
              this.dialogService.confirm({ content: `<img src="/assets/illegal.jpg" alt="illegal">` });
              break;
            case HttpStatusCode.Unauthorized:
              this.dialogService
                .confirm({ content: `It seems you're not logged...`, title: 'Sorry', buttons: ['Ok'] })
                .subscribe(async () => {
                  await this.router.navigate(['/auth', 'login']);
                });
              break;
            case HttpStatusCode.TooManyRequests:
              this.dialogService.confirm({
                content: `It seems you're requesting too much of our humble server, please wait a second before sending another request`,
                title: 'Dayum',
                buttons: ['Ok'],
              });
              break;
          }
        })
      );
    }
    return request$;
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Observable, OperatorFunction } from 'rxjs';
import { environment } from '@environment/environment';
import { HttpError } from '@model/http-error';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { AuthQuery } from '../../auth/auth.query';

@Injectable({ providedIn: 'root' })
export class HandleErrorDevInterceptor implements HttpInterceptor {
  private snackBarService = inject(SnackBarService);
  private modalService = inject(ModalService);
  private authQuery = inject(AuthQuery);

  private _snackBar(message: string, button: string, data: HttpError, isAdmin: boolean): void {
    const snack = this.snackBarService.open(message, { action: button });
    if (isAdmin) {
      snack.onAction$.subscribe(async () => {
        await this.modalService.openLazy(() => import('../error/error.component').then(c => c.ErrorComponent), {
          data,
          module: () => import('../error/error.module').then(m => m.ErrorModule),
        });
      });
    }
  }

  private _handleErrorOperator<T>(): OperatorFunction<T, T> {
    return catchAndThrow(httpError => {
      const isAdmin = this.authQuery.getIsAdmin();
      let message: string;
      const button = isAdmin ? 'Show more info' : 'Close';
      switch (httpError.status) {
        case HttpStatusCode.BadRequest:
          message = 'The data sent was wrong, bad request';
          break;
        case HttpStatusCode.NotFound:
          message = 'The data was not found, 404';
          break;
        case HttpStatusCode.TooManyRequests:
          message = 'Too many requests';
          break;
        default:
          message = httpError.error ?? 'Internal error';
          break;
      }
      this._snackBar('DEV - ' + message, button, httpError, isAdmin);
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const req$ = next.handle(req);
    if (!environment.production) {
      return req$.pipe(this._handleErrorOperator());
    }
    return req$;
  }
}

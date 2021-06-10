import { Injectable } from '@angular/core';
import { HttpError } from '@model/http-error';
import { OperatorFunction } from 'rxjs';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { SnackBarService } from '@shared/components/snack-bar/snack-bar.service';
import { ModalService } from '@shared/components/modal/modal.service';
import { AuthQuery } from '../../auth/auth.query';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HandleErrorService {
  constructor(
    private snackBarService: SnackBarService,
    private modalService: ModalService,
    private authQuery: AuthQuery
  ) {}

  private _snackBar(message: string, button: string, data: HttpError, isAdmin: boolean): void {
    const snack = this.snackBarService.open(message, { action: button });
    if (isAdmin) {
      snack.onAction$.subscribe(async () => {
        await this.modalService.openLazy(() => import('../error/error.component').then(c => c.ErrorComponent), {
          data,
        });
      });
    }
  }

  handleErrorOperator<T>(): OperatorFunction<T, T> {
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
}

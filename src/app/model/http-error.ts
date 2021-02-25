import { HttpErrorResponse as NgHttpErrorResponse } from '@angular/common/http';

export interface HttpError<T = any> {
  sqlErrono?: number;
  sqlMessage?: string;
  message: string;
  status: number;
  error?: string;
  name?: string;
  extra?: T;
}

export interface HttpErrorResponse extends NgHttpErrorResponse {
  error: HttpError;
}

import { HttpErrorResponse as NgHttpErrorResponse } from '@angular/common/http';

export interface HttpError<T = any> {
  message: string;
  status: number;
  error?: string;
  name?: string;
  extra?: T;
  sqlError?: any;
}

export interface HttpErrorResponse extends NgHttpErrorResponse {
  error: HttpError;
}

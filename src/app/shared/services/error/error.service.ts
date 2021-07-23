import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '@model/pagination';
import { AdminError } from '@model/admin-error';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  constructor(private http: HttpClient) {}

  readonly endPoint = 'error';

  paginate(page: number, limit: number): Observable<Pagination<AdminError>> {
    const params = new HttpParams({ page, limit });
    return this.http.get<Pagination<AdminError>>(`${this.endPoint}/paginate`, { params });
  }
}

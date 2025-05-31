import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Pagination } from '@model/pagination';
import { AdminError } from '@model/admin-error';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private http = inject(HttpClient);

  readonly endPoint = 'error';

  paginate(page: number, limit: number): Observable<Pagination<AdminError>> {
    const params = new HttpParams({ page, limit });
    return this.http.get<Pagination<AdminError>>(`${this.endPoint}/paginate`, { params }).pipe(
      map(pagination => ({
        ...pagination,
        items: pagination.items.map(item => {
          if (item.sqlParameters?.length) {
            item = {
              ...item,
              sqlParametersFormatted: item.sqlParameters.reduce(
                (sqlParametersFormatted, sqlParameter, index) =>
                  sqlParametersFormatted + `\n-    $${index + 1}: ${sqlParameter}`,
                'Parameters: '
              ),
            };
          }
          return item;
        }),
      }))
    );
  }
}

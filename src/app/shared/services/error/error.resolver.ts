import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AdminError } from '@model/admin-error';
import { ErrorService } from '@shared/services/error/error.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { Pagination } from '@model/pagination';

@Injectable({ providedIn: 'root' })
export class ErrorResolver  {
  constructor(private errorService: ErrorService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Pagination<AdminError>> | Promise<Pagination<AdminError>> | Pagination<AdminError> {
    const page = +(route.queryParamMap.get(RouteParamEnum.page) ?? 1);
    const itemsPerPage = +(route.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.errorService.paginate(page, itemsPerPage);
  }
}

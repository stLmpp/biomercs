import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AdminError } from '@model/admin-error';
import { ErrorService } from '@shared/services/error/error.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { Pagination } from '@model/pagination';

export function errorResolver(): ResolveFn<Pagination<AdminError>> {
  return route => {
    const errorService = inject(ErrorService);
    const page = +(route.queryParamMap.get(RouteParamEnum.page) ?? 1);
    const itemsPerPage = +(route.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return errorService.paginate(page, itemsPerPage);
  };
}

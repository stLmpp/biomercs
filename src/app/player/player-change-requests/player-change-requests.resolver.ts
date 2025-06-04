import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ScoreChangeRequestsPagination } from '@model/score-change-request';
import { ScoreService } from '../../score/score.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function playerChangeRequestsResolver(): ResolveFn<ScoreChangeRequestsPagination> {
  return route => {
    const page = +(route.queryParamMap.get(RouteParamEnum.page) ?? 1);
    const limit = +(route.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return inject(ScoreService).findChangeRequests(page, limit);
  };
}

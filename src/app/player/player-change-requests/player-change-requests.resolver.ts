import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ScoreChangeRequestsPagination } from '@model/score-change-request';
import { ScoreService } from '../../score/score.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class PlayerChangeRequestsResolver {
  private scoreService = inject(ScoreService);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<ScoreChangeRequestsPagination>
    | Promise<ScoreChangeRequestsPagination>
    | ScoreChangeRequestsPagination {
    const page = +(route.queryParamMap.get(RouteParamEnum.page) ?? 1);
    const limit = +(route.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.scoreService.findChangeRequests(page, limit);
  }
}

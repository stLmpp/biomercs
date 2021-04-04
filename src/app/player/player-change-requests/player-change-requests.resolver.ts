import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ScoreChangeRequestsPaginationVW } from '@model/score-change-request';
import { ScoreService } from '../../score/score.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class PlayerChangeRequestsResolver implements Resolve<ScoreChangeRequestsPaginationVW> {
  constructor(private scoreService: ScoreService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<ScoreChangeRequestsPaginationVW>
    | Promise<ScoreChangeRequestsPaginationVW>
    | ScoreChangeRequestsPaginationVW {
    const page = +(route.queryParamMap.get(RouteParamEnum.page) ?? 1);
    const limit = +(route.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.scoreService.findChangeRequests(page, limit);
  }
}

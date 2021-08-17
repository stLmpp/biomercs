import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ScoreGroupedByStatus } from '@model/score-grouped-by-status';
import { ScoreService } from '../../score/score.service';
import { AuthQuery } from '../../auth/auth.query';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { orderByOperator } from '@stlmpp/utils';

@Injectable({ providedIn: 'root' })
export class PlayerRejectedPendingScoresResolver implements Resolve<ScoreGroupedByStatus[]> {
  constructor(private scoreService: ScoreService, private authQuery: AuthQuery) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ScoreGroupedByStatus[]> | Promise<ScoreGroupedByStatus[]> | ScoreGroupedByStatus[] {
    const idPlayer = +route.paramMap.get(RouteParamEnum.idPlayer)!;
    if (this.authQuery.getIsSameAsLogged(idPlayer)) {
      return this.scoreService
        .findRejectedAndPendingScoresByIdUser()
        .pipe(orderByOperator(status => status.scores.length, 'desc'));
    } else {
      return [];
    }
  }
}

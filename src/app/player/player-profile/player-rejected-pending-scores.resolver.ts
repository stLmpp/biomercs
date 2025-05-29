import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ScoreGroupedByStatus } from '@model/score-grouped-by-status';
import { ScoreService } from '../../score/score.service';
import { AuthQuery } from '../../auth/auth.query';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class PlayerRejectedPendingScoresResolver  {
  private scoreService = inject(ScoreService);
  private authQuery = inject(AuthQuery);


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ScoreGroupedByStatus[]> | Promise<ScoreGroupedByStatus[]> | ScoreGroupedByStatus[] {
    const idPlayer = +route.paramMap.get(RouteParamEnum.idPlayer)!;
    if (this.authQuery.getIsSameAsLogged(idPlayer)) {
      return this.scoreService.findRejectedAndPendingScoresByIdUser();
    } else {
      return [];
    }
  }
}

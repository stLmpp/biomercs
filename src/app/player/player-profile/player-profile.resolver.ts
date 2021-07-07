import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { ScoreGroupedByStatus } from '@model/score-grouped-by-status';
import { PlayerService } from '../player.service';
import { ScoreService } from '../../score/score.service';
import { AuthQuery } from '../../auth/auth.query';
import { Observable, of, switchMap } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { orderByOperator } from '@stlmpp/utils';

@Injectable({ providedIn: 'root' })
export class PlayerProfileResolver implements Resolve<ScoreGroupedByStatus[]> {
  constructor(private playerService: PlayerService, private scoreService: ScoreService, private authQuery: AuthQuery) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ScoreGroupedByStatus[]> | Promise<ScoreGroupedByStatus[]> | ScoreGroupedByStatus[] {
    const idPlayer = +route.paramMap.get(RouteParamEnum.idPlayer)!;
    const scoreGroupedByStatus$ = this.scoreService
      .findRejectedAndPendingScoresByIdUser()
      .pipe(orderByOperator(status => status.scores.length, 'desc'));
    return this.playerService.getById(idPlayer).pipe(
      switchMap(() => {
        if (this.authQuery.getIsSameAsLogged(idPlayer)) {
          return scoreGroupedByStatus$;
        }
        return of([]);
      })
    );
  }
}

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ScoreGroupedByStatus } from '@model/score-grouped-by-status';
import { ScoreService } from '../../score/score.service';
import { AuthQuery } from '../../auth/auth.query';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function playerRejectedPendingScoresResolver(): ResolveFn<ScoreGroupedByStatus[]> {
  return route => {
    const scoreService = inject(ScoreService);
    const authQuery = inject(AuthQuery);

    const idPlayer = +route.paramMap.get(RouteParamEnum.idPlayer)!;
    if (authQuery.getIsSameAsLogged(idPlayer)) {
      return scoreService.findRejectedAndPendingScoresByIdUser();
    } else {
      return [];
    }
  };
}

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { PlayerService } from '../player.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function playerProfilePersonaNameGuard(): CanActivateFn {
  return route => {
    const router = inject(Router);
    const playerService = inject(PlayerService);
    const personaName = route.paramMap.get(RouteParamEnum.personaName)!;
    return playerService
      .getIdByPersonaName(personaName)
      .pipe(map(idPlayer => router.createUrlTree(['/player', idPlayer])));
  };
}

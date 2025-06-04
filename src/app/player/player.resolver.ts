import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PlayerService } from './player.service';
import { Player } from '@model/player';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function playerResolver(): ResolveFn<Player> {
  return route => {
    const playerService = inject(PlayerService);
    const idPlayer = +route.paramMap.get(RouteParamEnum.idPlayer)!;
    return playerService.getById(idPlayer);
  };
}

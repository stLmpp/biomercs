import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PlayerService } from './player.service';
import { Observable } from 'rxjs';
import { Player } from '@model/player';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class PlayerResolver  {
  private playerService = inject(PlayerService);


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Player> | Promise<Player> | Player {
    const idPlayer = +route.paramMap.get(RouteParamEnum.idPlayer)!;
    return this.playerService.getById(idPlayer);
  }
}

import { Injectable } from '@angular/core';
import { TitleResolver } from '@shared/title/title-resolver';
import { PlayerQuery } from '../player.query';
import { map, Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class PlayerProfileTitleResolver implements TitleResolver {
  constructor(private playerQuery: PlayerQuery) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<string | null | undefined> | Promise<string | null | undefined> | string | null | undefined {
    const idPlayer = route.paramMap.get(RouteParamEnum.idPlayer);
    if (idPlayer) {
      return this.playerQuery
        .selectEntity(+idPlayer)
        .pipe(map(player => player?.personaName && player.personaName + ' Profile'));
    }
    return undefined;
  }
}

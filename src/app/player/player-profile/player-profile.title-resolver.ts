import { Injectable } from '@angular/core';
import { TitleResolver } from '@shared/title/title-resolver';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Player } from '@model/player';

@Injectable({ providedIn: 'root' })
export class PlayerProfileTitleResolver implements TitleResolver {
  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<string | null | undefined> | Promise<string | null | undefined> | string | null | undefined {
    const player: Player | undefined = route.data[RouteDataEnum.player];
    return player && player.personaName + ' Profile';
  }
}

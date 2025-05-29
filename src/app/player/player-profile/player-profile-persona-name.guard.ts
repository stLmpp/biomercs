import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { PlayerService } from '../player.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({
  providedIn: 'root',
})
export class PlayerProfilePersonaNameGuard {
  private playerService = inject(PlayerService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const personaName = route.paramMap.get(RouteParamEnum.personaName)!;
    return this.playerService
      .getIdByPersonaName(personaName)
      .pipe(map(idPlayer => this.router.createUrlTree(['/player', idPlayer])));
  }
}

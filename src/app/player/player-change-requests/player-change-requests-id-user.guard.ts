import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { PlayerService } from '../player.service';

@Injectable({ providedIn: 'root' })
export class PlayerChangeRequestsIdUserGuard implements CanActivate {
  constructor(private playerService: PlayerService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idUser = +route.paramMap.get(RouteParamEnum.idUser)!;
    return this.playerService
      .getIdByIdUser(idUser)
      .pipe(map(idPlayer => this.router.createUrlTree(['/player', idPlayer, 'change-requests'])));
  }
}

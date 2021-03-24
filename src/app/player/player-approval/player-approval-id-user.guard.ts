import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayerService } from '../player.service';
import { map } from 'rxjs/operators';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({
  providedIn: 'root',
})
export class PlayerApprovalIdUserGuard implements CanActivate {
  constructor(private playerService: PlayerService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idUser = +route.paramMap.get(RouteParamEnum.idUser)!;
    return this.playerService
      .getIdByIdUser(idUser)
      .pipe(map(idPlayer => this.router.createUrlTree(['/player', idPlayer, 'approval'])));
  }
}

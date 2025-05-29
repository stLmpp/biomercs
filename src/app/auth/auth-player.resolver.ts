import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Player } from '@model/player';
import { PlayerService } from '../player/player.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthPlayerResolver  {
  constructor(private playerService: PlayerService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Player> | Promise<Player> | Player {
    return this.playerService.getAuth();
  }
}

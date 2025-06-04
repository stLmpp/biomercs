import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Player } from '@model/player';
import { PlayerService } from '../player/player.service';

export function authPlayerResolver(): ResolveFn<Player> {
  return () => inject(PlayerService).getAuth();
}

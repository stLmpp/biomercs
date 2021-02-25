import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerStore } from './player.store';
import { tap } from 'rxjs/operators';
import { Player, PlayerUpdate } from '@model/player';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private http: HttpClient, private playerStore: PlayerStore) {}

  endPoint = 'player';

  getById(idPlayer: number): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/${idPlayer}`).pipe(
      tap(player => {
        this.playerStore.upsert(idPlayer, player);
      })
    );
  }

  getIdByPersonaName(personaName: string): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/persona-name/${personaName}/id`);
  }

  getIdByIdUser(idUser: number): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/user/${idUser}/id`);
  }

  update(idPlayer: number, dto: PlayerUpdate): Observable<Player> {
    return this.http.patch<Player>(`${this.endPoint}/${idPlayer}`, dto).pipe(
      tap(player => {
        this.playerStore.upsert(idPlayer, player);
      })
    );
  }
}

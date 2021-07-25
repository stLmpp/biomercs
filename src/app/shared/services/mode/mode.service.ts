import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { ModeStore } from './mode.store';
import { httpCache } from '../../operators/http-cache';
import { Mode } from '@model/mode';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class ModeService {
  constructor(private http: HttpClient, private modeStore: ModeStore) {}

  endPoint = 'mode';

  findByIdPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Observable<Mode[]> {
    return this.http.get<Mode[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}`).pipe(
      httpCache(this.modeStore, [idPlatform, idGame, idMiniGame]),
      tap(modes => {
        this.modeStore.upsert(modes);
      })
    );
  }

  findByIdPlatformsGamesMiniGames(idPlatforms: number[], idGames: number[], idMiniGames: number[]): Observable<Mode[]> {
    const params = new HttpParams({ idPlatforms, idGames, idMiniGames });
    return this.http.get<Mode[]>(`${this.endPoint}/platforms/games/mini-games`, { params }).pipe(
      httpCache(this.modeStore, [...idPlatforms, ...idGames, ...idMiniGames]),
      tap(modes => {
        this.modeStore.upsert(modes);
      })
    );
  }

  findApprovalByIdPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Observable<Mode[]> {
    return this.http
      .get<Mode[]>(`${this.endPoint}/approval/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}`)
      .pipe(
        tap(modes => {
          this.modeStore.upsert(modes);
        })
      );
  }
}

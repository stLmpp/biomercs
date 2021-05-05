import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MiniGameStore } from './mini-game.store';
import { httpCache } from '../../operators/http-cache';
import { MiniGame } from '@model/mini-game';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class MiniGameService {
  constructor(private http: HttpClient, private miniGameStore: MiniGameStore) {}

  endPoint = 'mini-game';

  findByIdPlatformGame(idPlatform: number, idGame: number): Observable<MiniGame[]> {
    return this.http.get<MiniGame[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}`).pipe(
      httpCache(this.miniGameStore, [idPlatform, idGame]),
      tap(miniGames => {
        this.miniGameStore.upsert(miniGames);
      })
    );
  }

  findByIdPlatformsGames(idPlatforms: number[], idGames: number[]): Observable<MiniGame[]> {
    const params = new HttpParams({ idPlatforms, idGames });
    return this.http
      .get<MiniGame[]>(`${this.endPoint}/platforms/games`, { params })
      .pipe(
        httpCache(this.miniGameStore, [...idPlatforms, ...idGames]),
        tap(miniGames => {
          this.miniGameStore.upsert(miniGames);
        })
      );
  }
}

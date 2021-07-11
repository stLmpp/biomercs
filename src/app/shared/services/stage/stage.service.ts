import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { StageStore } from './stage.store';
import { httpCache } from '../../operators/http-cache';
import { Stage } from '@model/stage';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class StageService {
  constructor(private http: HttpClient, private stageStore: StageStore) {}

  endPoint = 'stage';

  findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<Stage[]> {
    return this.http
      .get<Stage[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}`)
      .pipe(
        httpCache(this.stageStore, [idPlatform, idGame, idMiniGame, idMode]),
        tap(stages => {
          this.stageStore.upsert(stages);
        })
      );
  }

  findByIdPlatformsGamesMiniGamesModes(
    idPlatforms: number[],
    idGames: number[],
    idMiniGames: number[],
    idModes: number[]
  ): Observable<Stage[]> {
    const params = new HttpParams({ idPlatforms, idGames, idMiniGames, idModes });
    return this.http.get<Stage[]>(`${this.endPoint}/platforms/games/mini-games/modes`, { params }).pipe(
      httpCache(this.stageStore, [...idPlatforms, ...idGames, ...idMiniGames, ...idModes]),
      tap(stages => {
        this.stageStore.upsert(stages);
      })
    );
  }

  findApprovalByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<Stage[]> {
    return this.http
      .get<Stage[]>(
        `${this.endPoint}/approval/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}`
      )
      .pipe(
        tap(stages => {
          this.stageStore.upsert(stages);
        })
      );
  }
}

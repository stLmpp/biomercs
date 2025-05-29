import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Stage } from '@model/stage';
import { HttpParams } from '@util/http-params';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class StageService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);


  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'stage';

  findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<Stage[]> {
    return this.http
      .get<Stage[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}`)
      .pipe(this._cache.use(idPlatform, idGame, idMiniGame, idMode));
  }

  findByIdPlatformsGamesMiniGamesModes(
    idPlatforms: number[],
    idGames: number[],
    idMiniGames: number[],
    idModes: number[]
  ): Observable<Stage[]> {
    const params = new HttpParams({ idPlatforms, idGames, idMiniGames, idModes });
    return this.http
      .get<Stage[]>(`${this.endPoint}/platforms/games/mini-games/modes`, { params })
      .pipe(this._cache.use(idPlatforms, idGames, idMiniGames, idModes));
  }

  findApprovalByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<Stage[]> {
    return this.http.get<Stage[]>(
      `${this.endPoint}/approval/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}`
    );
  }
}

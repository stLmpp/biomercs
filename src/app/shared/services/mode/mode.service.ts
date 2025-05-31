import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mode } from '@model/mode';
import { HttpParams } from '@util/http-params';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class ModeService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'mode';

  findByIdPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Observable<Mode[]> {
    return this.http
      .get<Mode[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}`)
      .pipe(this._cache.use(idPlatform, idGame, idMiniGame));
  }

  findByIdPlatformsGamesMiniGames(idPlatforms: number[], idGames: number[], idMiniGames: number[]): Observable<Mode[]> {
    const params = new HttpParams({ idPlatforms, idGames, idMiniGames });
    return this.http
      .get<Mode[]>(`${this.endPoint}/platforms/games/mini-games`, { params })
      .pipe(this._cache.use(idPlatforms, idGames, idMiniGames));
  }

  findApprovalByIdPlatformGameMiniGame(idPlatform: number, idGame: number, idMiniGame: number): Observable<Mode[]> {
    return this.http.get<Mode[]>(
      `${this.endPoint}/approval/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}`
    );
  }
}

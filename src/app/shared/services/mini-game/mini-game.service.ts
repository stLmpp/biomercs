import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MiniGame } from '@model/mini-game';
import { HttpParams } from '@util/http-params';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class MiniGameService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);


  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'mini-game';

  findByIdPlatformGame(idPlatform: number, idGame: number): Observable<MiniGame[]> {
    return this.http
      .get<MiniGame[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}`)
      .pipe(this._cache.use(idPlatform, idGame));
  }

  findByIdPlatformsGames(idPlatforms: number[], idGames: number[]): Observable<MiniGame[]> {
    const params = new HttpParams({ idPlatforms, idGames });
    return this.http
      .get<MiniGame[]>(`${this.endPoint}/platforms/games`, { params })
      .pipe(this._cache.use(idPlatforms, idGames));
  }

  findApprovalByIdPlatformGame(idPlatform: number, idGame: number): Observable<MiniGame[]> {
    return this.http.get<MiniGame[]>(`${this.endPoint}/approval/platform/${idPlatform}/game/${idGame}`);
  }
}

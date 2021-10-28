import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CharacterWithCharacterCostumes } from '@model/character';
import { HttpParams } from '@util/http-params';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'character';

  findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<CharacterWithCharacterCostumes[]> {
    return this.http
      .get<CharacterWithCharacterCostumes[]>(
        `${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}`
      )
      .pipe(this._cache.use(idPlatform, idGame, idMiniGame, idMode));
  }

  findByIdPlatformsGamesMiniGamesModes(
    idPlatforms: number[],
    idGames: number[],
    idMiniGames: number[],
    idModes: number[]
  ): Observable<CharacterWithCharacterCostumes[]> {
    const params = new HttpParams({ idPlatforms, idGames, idMiniGames, idModes });
    return this.http
      .get<CharacterWithCharacterCostumes[]>(`${this.endPoint}/platforms/games/mini-games/modes`, { params })
      .pipe(this._cache.use(idPlatforms, idGames, idMiniGames, idModes));
  }
}

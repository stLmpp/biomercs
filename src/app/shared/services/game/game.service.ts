import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '@model/game';
import { HttpParams } from '@util/http-params';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class GameService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);


  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'game';

  findByIdPlatform(idPlatform: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.endPoint}/platform/${idPlatform}`).pipe(this._cache.use(idPlatform));
  }

  findByIdPlatforms(idPlatforms: number[]): Observable<Game[]> {
    const params = new HttpParams({ idPlatforms });
    return this.http.get<Game[]>(`${this.endPoint}/platforms`, { params }).pipe(this._cache.use(idPlatforms));
  }

  findApprovalByIdPlatform(idPlatform: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.endPoint}/approval/platform/${idPlatform}`);
  }
}

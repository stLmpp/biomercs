import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlatformInputType } from '@model/platform-input-type';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class PlatformInputTypeService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();
  readonly endPoint = 'platform-input-type';

  getByPlatform(idPlatform: number): Observable<PlatformInputType[]> {
    return this.http
      .get<PlatformInputType[]>(`${this.endPoint}/platform/${idPlatform}`)
      .pipe(this._cache.use(idPlatform));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Platform } from '@model/platform';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'platform';

  findAll(): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.endPoint).pipe(this._cache.use());
  }

  findApproval(): Observable<Platform[]> {
    return this.http.get<Platform[]>(`${this.endPoint}/approval`);
  }
}

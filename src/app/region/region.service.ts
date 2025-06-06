import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Region } from '@model/region';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class RegionService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private _cache = this.cacheService.createCache();

  endPoint = 'region';

  get(): Observable<Region[]> {
    return this.http.get<Region[]>(this.endPoint).pipe(this._cache.use());
  }
}

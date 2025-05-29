import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { UrlMetadata } from '@model/url-metadata';
import { HttpParams } from '@util/http-params';
import { Injectable, inject } from '@angular/core';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class UrlMetadataService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);


  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'url-metadata';

  get(url: string): Observable<UrlMetadata> {
    const params = new HttpParams({ url });
    return this.http.get<UrlMetadata>(`${this.endPoint}`, { params }).pipe(
      this._cache.use(url),
      map(urlMetadata => ({ ...urlMetadata, id: url }))
    );
  }
}

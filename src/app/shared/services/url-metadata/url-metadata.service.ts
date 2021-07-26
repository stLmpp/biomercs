import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { UrlMetadata } from '@model/url-metadata';
import { HttpParams } from '@util/http-params';
import { UrlMetadataStore } from '@shared/services/url-metadata/url-metadata.store';
import { Injectable } from '@angular/core';
import { useEntityCache } from '@util/operators/entity-cache';

@Injectable({ providedIn: 'root' })
export class UrlMetadataService {
  constructor(private http: HttpClient, private urlMetadataStore: UrlMetadataStore) {}

  readonly endPoint = 'url-metadata';

  get(url: string): Observable<UrlMetadata> {
    const params = new HttpParams({ url });
    return this.http.get<UrlMetadata>(`${this.endPoint}`, { params }).pipe(
      useEntityCache(url, this.urlMetadataStore),
      map(urlMetadata => ({ ...urlMetadata, id: url })),
      tap(urlMetadata => {
        this.urlMetadataStore.upsert(url, urlMetadata);
      })
    );
  }
}

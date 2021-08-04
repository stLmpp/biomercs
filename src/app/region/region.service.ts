import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RegionStore } from './region.store';
import { setLoading, useCache } from '@stlmpp/store';
import { Region } from '@model/region';
import { environment } from '@environment/environment.dev';

@Injectable({ providedIn: 'root' })
export class RegionService {
  constructor(private http: HttpClient, private regionStore: RegionStore) {}

  endPoint = 'region';

  get(): Observable<Region[]> {
    return this.http.get<Region[]>(this.endPoint).pipe(
      useCache(this.regionStore),
      setLoading(this.regionStore),
      tap(regions => {
        this.regionStore.setEntities(regions);
      })
    );
  }

  getFlagSvgUrl(flag: string): string {
    return `${environment.api}/${this.endPoint}/flag/svg/${flag}`;
  }

  getFlagSvg(flag: string): Observable<any> {
    const headers = new HttpHeaders({ accept: 'image/svg+xml' });
    return this.http.get<any>(`${this.endPoint}/flag/svg/${flag}`, { headers, responseType: 'text' as any });
  }
}

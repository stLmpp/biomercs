import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RegionStore } from './region.store';
import { setLoading, useCache } from '@stlmpp/store';
import { Region } from '@model/region';

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
}

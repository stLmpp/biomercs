import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PlatformStore } from './platform.store';
import { useCache } from '@stlmpp/store';
import { Platform } from '@model/platform';

@Injectable({ providedIn: 'root' })
export class PlatformService {
  constructor(private http: HttpClient, private platformStore: PlatformStore) {}

  endPoint = 'platform';

  findAll(): Observable<Platform[]> {
    return this.http.get<Platform[]>(this.endPoint).pipe(
      useCache(this.platformStore),
      tap(platforms => {
        this.platformStore.setEntities(platforms);
      })
    );
  }

  findApproval(playerMode = false): Observable<Platform[]> {
    const path = playerMode ? 'approval/player' : 'approval/admin';
    return this.http.get<Platform[]>(`${this.endPoint}/${path}`).pipe(
      tap(platforms => {
        this.platformStore.upsert(platforms);
      })
    );
  }
}

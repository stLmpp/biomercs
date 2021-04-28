import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class SteamService {
  constructor(private http: HttpClient) {}

  endPoint = 'steam';

  steamIdExists(steamid: string): Observable<boolean> {
    const params = new HttpParams({ steamid }, true);
    return this.http.get<boolean>(`${this.endPoint}/exists`, { params });
  }
}

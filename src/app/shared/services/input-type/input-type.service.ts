import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputType } from '@model/input-type';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class InputTypeService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'input-type';

  get(): Observable<InputType[]> {
    return this.http.get<InputType[]>(this.endPoint).pipe(this._cache.use());
  }

  getByPlatform(idPlatform: number): Observable<InputType[]> {
    return this.http.get<InputType[]>(`${this.endPoint}/platform/${idPlatform}`).pipe(this._cache.use(idPlatform));
  }
}

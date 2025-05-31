import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputType } from '@model/input-type';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class InputTypeService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'input-type';

  get(): Observable<InputType[]> {
    return this.http.get<InputType[]>(this.endPoint).pipe(this._cache.use());
  }
}

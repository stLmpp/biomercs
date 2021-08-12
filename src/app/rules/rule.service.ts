import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rule, RuleAdd, RuleUpsert } from '@model/rule';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class RuleService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'rule';

  add(dto: RuleAdd): Observable<Rule> {
    return this.http.post<Rule>(this.endPoint, dto).pipe(this._cache.burstAll());
  }

  upsert(dtos: RuleUpsert[]): Observable<Rule[]> {
    return this.http.post<Rule[]>(`${this.endPoint}/upsert`, dtos).pipe(this._cache.burstAll());
  }

  get(): Observable<Rule[]> {
    return this.http.get<Rule[]>(this.endPoint).pipe(this._cache.use());
  }
}

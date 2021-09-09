import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeratorAddAndDeleteDto, ModeratorWithInfo } from '@model/forum/moderator';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class ModeratorService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'forum/moderator';

  getAll(): Observable<ModeratorWithInfo[]> {
    return this.http.get<ModeratorWithInfo[]>(this.endPoint).pipe(this._cache.use());
  }

  addAndDelete(dto: ModeratorAddAndDeleteDto): Observable<ModeratorWithInfo[]> {
    return this.http.put<ModeratorWithInfo[]>(`${this.endPoint}/add-and-delete`, dto).pipe(this._cache.burst());
  }
}

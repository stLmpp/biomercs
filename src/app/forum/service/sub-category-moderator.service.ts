import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CacheService } from '@shared/cache/cache';
import { Observable } from 'rxjs';
import { SubCategoryAddAndDeleteDto, SubCategoryModerator } from '@model/forum/sub-category-moderator';

@Injectable({ providedIn: 'root' })
export class SubCategoryModeratorService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'forum/sub-category-moderator';

  getBySubCategory(idSubCategory: number): Observable<SubCategoryModerator[]> {
    return this.http
      .get<SubCategoryModerator[]>(`${this.endPoint}/sub-category/${idSubCategory}`)
      .pipe(this._cache.use(idSubCategory));
  }

  addAndDelete(idSubCategory: number, dto: SubCategoryAddAndDeleteDto): Observable<SubCategoryModerator[]> {
    return this.http
      .put<SubCategoryModerator[]>(`${this.endPoint}/sub-category/${idSubCategory}/add-and-delete`, dto)
      .pipe(this._cache.burst(idSubCategory));
  }
}

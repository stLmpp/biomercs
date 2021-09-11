import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  SubCategory,
  SubCategoryAddDto,
  SubCategoryOrderDto,
  SubCategoryUpdateDto,
  SubCategoryWithModeratorsInfo,
} from '@model/forum/sub-category';
import { CacheService } from '@shared/cache/cache';
import { Moderator } from '@model/forum/moderator';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();
  readonly endPoint = 'forum/sub-category';

  add(dto: SubCategoryAddDto): Observable<SubCategoryWithModeratorsInfo> {
    return this.http
      .post<SubCategory>(this.endPoint, dto)
      .pipe(map(subCategory => ({ ...subCategory, moderators: [], topicCount: 0, postCount: 0, hasNewPosts: false })));
  }

  update(idSubCategory: number, dto: SubCategoryUpdateDto): Observable<SubCategory> {
    return this.http
      .patch<SubCategory>(`${this.endPoint}/${idSubCategory}`, dto)
      .pipe(this._cache.burst(idSubCategory));
  }

  updateOrder(dtos: SubCategoryOrderDto[]): Observable<SubCategory[]> {
    return this.http.put<SubCategory[]>(`${this.endPoint}/order`, dtos);
  }

  getById(idSubCategory: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.endPoint}/${idSubCategory}`).pipe(this._cache.use(idSubCategory));
  }

  getModerators(idSubCategory: number): Observable<Moderator[]> {
    return this.http.get<Moderator[]>(`${this.endPoint}/${idSubCategory}/moderators`);
  }
}

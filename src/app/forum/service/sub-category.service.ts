import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import {
  SubCategory,
  SubCategoryAddDto,
  SubCategoryOrderDto,
  SubCategoryUpdateDto,
  SubCategoryWithModeratorsInfo,
  SubCategoryWithTopics,
} from '@model/forum/sub-category';
import { CacheService } from '@shared/cache/cache';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);


  private readonly _cache = this.cacheService.createCache();
  readonly endPoint = 'forum/sub-category';

  add(dto: SubCategoryAddDto): Observable<SubCategoryWithModeratorsInfo> {
    return this.http.post<SubCategory>(this.endPoint, dto).pipe(
      map(subCategory => ({
        ...subCategory,
        moderators: [],
        topicCount: 0,
        postCount: 0,
        hasNewPosts: false,
        isModerator: false,
      }))
    );
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

  getByIdWithTopics(idSubCategory: number, page: number, limit: number): Observable<SubCategoryWithTopics> {
    const params = new HttpParams({ page, limit });
    return this.http.get<SubCategoryWithTopics>(`${this.endPoint}/${idSubCategory}/with/info/moderators/topics`, {
      params,
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubCategory, SubCategoryAddDto, SubCategoryUpdateDto } from '@model/forum/sub-category';
import { CacheService } from '@shared/cache/cache';
import { Moderator } from '@model/forum/moderator';

@Injectable({ providedIn: 'root' })
export class SubCategoryService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();
  readonly endPoint = 'forum/sub-category';

  add(dto: SubCategoryAddDto): Observable<SubCategory> {
    return this.http.post<SubCategory>(this.endPoint, dto);
  }

  update(idSubCategory: number, dto: SubCategoryUpdateDto): Observable<SubCategory> {
    return this.http
      .patch<SubCategory>(`${this.endPoint}/${idSubCategory}`, dto)
      .pipe(this._cache.burst(idSubCategory));
  }

  updateOrder(idSubCategories: number[]): Observable<SubCategory[]> {
    return this.http.put<SubCategory[]>(`${this.endPoint}/order`, idSubCategories);
  }

  getById(idSubCategory: number): Observable<SubCategory> {
    return this.http.get<SubCategory>(`${this.endPoint}/${idSubCategory}`).pipe(this._cache.use(idSubCategory));
  }

  getModerators(idSubCategory: number): Observable<Moderator[]> {
    return this.http.get<Moderator[]>(`${this.endPoint}/${idSubCategory}/moderators`);
  }
}

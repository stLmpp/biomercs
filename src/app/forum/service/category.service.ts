import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryAddDto, CategoryUpdateDto, CategoryWithSubCategories } from '@model/forum/category';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient, private cacheService: CacheService) {}

  private readonly _cache = this.cacheService.createCache();
  readonly endPoint = 'forum/category';

  add(dto: CategoryAddDto): Observable<Category> {
    return this.http.post<Category>(this.endPoint, dto);
  }

  update(idCategory: number, dto: CategoryUpdateDto): Observable<Category> {
    return this.http.patch<Category>(`${this.endPoint}/${idCategory}`, dto).pipe(this._cache.burst(idCategory));
  }

  updateOrder(idCategories: number[]): Observable<Category[]> {
    return this.http.put<Category[]>(`${this.endPoint}/order`, idCategories);
  }

  getAll(): Observable<CategoryWithSubCategories[]> {
    return this.http.get<CategoryWithSubCategories[]>(this.endPoint);
  }

  getById(idCategory: number): Observable<Category> {
    return this.http.get<Category>(`${this.endPoint}/${idCategory}`).pipe(this._cache.use(idCategory));
  }
}

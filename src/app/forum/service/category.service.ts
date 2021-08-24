import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryAddDto, CategoryUpdateDto, CategoryWithSubCategories } from '@model/forum/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  readonly endPoint = 'forum/category';

  add(dto: CategoryAddDto): Observable<Category> {
    return this.http.post<Category>(this.endPoint, dto);
  }

  update(idCategory: number, dto: CategoryUpdateDto): Observable<Category> {
    return this.http.patch<Category>(`${this.endPoint}/${idCategory}`, dto);
  }

  updateOrder(idCategories: number[]): Observable<Category[]> {
    return this.http.put<Category[]>(`${this.endPoint}/order`, idCategories);
  }

  getAll(): Observable<CategoryWithSubCategories[]> {
    return this.http.get<CategoryWithSubCategories[]>(this.endPoint);
  }

  getById(idCategory: number): Observable<Category> {
    return this.http.get<Category>(`${this.endPoint}/${idCategory}`);
  }
}

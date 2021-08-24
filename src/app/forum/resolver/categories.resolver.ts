import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CategoryWithSubCategories } from '@model/forum/category';
import { CategoryService } from '../service/category.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriesResolver implements Resolve<CategoryWithSubCategories[]> {
  constructor(private categoryService: CategoryService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoryWithSubCategories[]> | Promise<CategoryWithSubCategories[]> | CategoryWithSubCategories[] {
    return this.categoryService.getAll();
  }
}

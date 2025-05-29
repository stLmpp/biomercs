import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CategoriesWithRecentTopics } from '@model/forum/category';
import { CategoryService } from '../service/category.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriesWithRecentTopicsResolver  {
  private categoryService = inject(CategoryService);


  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoriesWithRecentTopics> | Promise<CategoriesWithRecentTopics> | CategoriesWithRecentTopics {
    return this.categoryService.getAllWithRecentTopics();
  }
}

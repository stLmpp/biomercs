import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CategoriesWithRecentTopics } from '@model/forum/category';
import { CategoryService } from '../service/category.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriesWithRecentTopicsResolver implements Resolve<CategoriesWithRecentTopics> {
  constructor(private categoryService: CategoryService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<CategoriesWithRecentTopics> | Promise<CategoriesWithRecentTopics> | CategoriesWithRecentTopics {
    return this.categoryService.getAllWithRecentTopics();
  }
}

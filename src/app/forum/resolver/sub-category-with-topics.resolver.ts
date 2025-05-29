import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SubCategoryWithTopics } from '@model/forum/sub-category';
import { SubCategoryService } from '../service/sub-category.service';
import { Observable, tap } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class SubCategoryWithTopicsResolver {
  private subCategoryService = inject(SubCategoryService);
  private router = inject(Router);
  private cacheService = inject(CacheService);

  private readonly _cache = this.cacheService.createCache(5000);

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SubCategoryWithTopics> | Promise<SubCategoryWithTopics> | SubCategoryWithTopics {
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const page = +(route.paramMap.get(RouteParamEnum.pageSubCategory) ?? 1);
    return this.subCategoryService.getByIdWithTopics(idSubCategory, page, 10).pipe(
      tap(subCategory => {
        if (subCategory.topics.meta.totalPages && page > subCategory.topics.meta.totalPages) {
          this.router
            .navigate([
              '/forum/category',
              subCategory.idCategory,
              'sub-category',
              subCategory.id,
              'page',
              subCategory.topics.meta.totalPages,
            ])
            .then();
        }
      }),
      this._cache.use(idSubCategory, page)
    );
  }
}

import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { SubCategoryWithTopics } from '@model/forum/sub-category';
import { SubCategoryService } from '../service/sub-category.service';
import { tap } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { CacheService } from '@shared/cache/cache';

export function subCategoryWithTopicsResolver(): ResolveFn<SubCategoryWithTopics> {
  return route => {
    const subCategoryService = inject(SubCategoryService);
    const router = inject(Router);
    const cacheService = inject(CacheService);
    const cache = cacheService.createCache(5000);

    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const page = +(route.paramMap.get(RouteParamEnum.pageSubCategory) ?? 1);

    return subCategoryService.getByIdWithTopics(idSubCategory, page, 10).pipe(
      tap(subCategory => {
        if (subCategory.topics.meta.totalPages && page > subCategory.topics.meta.totalPages) {
          router
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
      cache.use(idSubCategory, page)
    );
  };
}

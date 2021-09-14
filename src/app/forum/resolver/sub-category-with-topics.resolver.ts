import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { SubCategoryWithTopics } from '@model/forum/sub-category';
import { SubCategoryService } from '../service/sub-category.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class SubCategoryWithTopicsResolver implements Resolve<SubCategoryWithTopics> {
  constructor(private subCategoryService: SubCategoryService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<SubCategoryWithTopics> | Promise<SubCategoryWithTopics> | SubCategoryWithTopics {
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const page = +(route.queryParamMap.get(RouteParamEnum.page) ?? 1);
    const limit = +(route.queryParamMap.get(RouteParamEnum.itemsPerPage) ?? 10);
    return this.subCategoryService.getByIdWithTopics(idSubCategory, page, limit);
  }
}

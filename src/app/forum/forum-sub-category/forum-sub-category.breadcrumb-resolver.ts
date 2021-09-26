import { BreadcrumbResolver } from '@shared/breadcrumbs/breadcrumb-resolver';
import { Injectable } from '@angular/core';
import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { SubCategoryWithTopics } from '@model/forum/sub-category';

@Injectable({ providedIn: 'root' })
export class ForumSubCategoryBreadcrumbResolver implements BreadcrumbResolver {
  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): string | BreadcrumbsItem | Observable<BreadcrumbsItem> {
    const subCategory: SubCategoryWithTopics = activatedRouteSnapshot.data[RouteDataEnum.subCategoryWithTopics];
    return subCategory.name;
  }
}

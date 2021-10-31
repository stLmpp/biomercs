import { Injectable } from '@angular/core';
import { BreadcrumbsResolver } from '@shared/breadcrumbs/breadcrumbs-resolver';
import { ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbsItem } from '@shared/breadcrumbs/breadcrumbs';
import { Observable } from 'rxjs';
import { TopicWithPosts } from '@model/forum/topic';
import { RouteDataEnum } from '@model/enum/route-data.enum';

@Injectable({ providedIn: 'root' })
export class ForumTopicBreadcrumbsResolver implements BreadcrumbsResolver {
  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot): string | BreadcrumbsItem | Observable<BreadcrumbsItem> {
    const topic: TopicWithPosts = activatedRouteSnapshot.data[RouteDataEnum.topicWithPosts];
    return topic.name;
  }
}

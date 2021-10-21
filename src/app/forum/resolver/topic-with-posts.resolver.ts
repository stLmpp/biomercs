import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TopicWithPosts } from '@model/forum/topic';
import { TopicService } from '../service/topic.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class TopicWithPostsResolver implements Resolve<TopicWithPosts> {
  constructor(private topicService: TopicService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<TopicWithPosts> | Promise<TopicWithPosts> | TopicWithPosts {
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const idTopic = +(route.paramMap.get(RouteParamEnum.idTopic) ?? 0);
    const page = +(route.paramMap.get(RouteParamEnum.pageTopic) ?? 1);
    return this.topicService.getByIdWithPosts(idSubCategory, idTopic, page, 10);
  }
}

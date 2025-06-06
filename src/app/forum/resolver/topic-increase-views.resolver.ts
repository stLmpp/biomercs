import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TopicService } from '../service/topic.service';
import { Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class TopicIncreaseViewsResolver implements Resolve<void> {
  constructor(private topicService: TopicService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> | Promise<void> | void {
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const idTopic = +(route.paramMap.get(RouteParamEnum.idTopic) ?? 0);
    return this.topicService.increaseViews(idSubCategory, idTopic);
  }
}

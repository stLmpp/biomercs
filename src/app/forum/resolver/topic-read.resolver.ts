import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TopicService } from '../service/topic.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TopicReadResolver implements Resolve<void> {
  constructor(private topicService: TopicService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<void> | Promise<void> | void {
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? -1);
    const idTopic = +(route.paramMap.get(RouteParamEnum.idTopic) ?? -1);
    return this.topicService.read(idSubCategory, idTopic);
  }
}

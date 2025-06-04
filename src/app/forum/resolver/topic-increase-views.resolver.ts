import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { TopicService } from '../service/topic.service';
import { RouteParamEnum } from '@model/enum/route-param.enum';

export function topicIncreaseViewsResolver(): ResolveFn<void> {
  return route => {
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const idTopic = +(route.paramMap.get(RouteParamEnum.idTopic) ?? 0);
    return inject(TopicService).increaseViews(idSubCategory, idTopic);
  };
}

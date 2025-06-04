import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { TopicWithPosts } from '@model/forum/topic';
import { TopicService } from '../service/topic.service';
import { of, tap } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';
import { refreshMap } from '@util/operators/refresh-map';

export function topicWithPostsResolver(): ResolveFn<TopicWithPosts> {
  return route => {
    const topicService = inject(TopicService);
    const router = inject(Router);

    const idCategory = +(route.paramMap.get(RouteParamEnum.idCategory) ?? 0);
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? 0);
    const pageSubcategory = +(route.paramMap.get(RouteParamEnum.pageSubCategory) ?? 1);
    const idTopic = +(route.paramMap.get(RouteParamEnum.idTopic) ?? 0);
    const page = +(route.paramMap.get(RouteParamEnum.pageTopic) ?? 1);

    return topicService.getByIdWithPosts(idSubCategory, idTopic, page, 10).pipe(
      tap(topic => {
        if (topic.posts.meta.totalPages && page > topic.posts.meta.totalPages) {
          router
            .navigate([
              '/forum/category',
              idCategory,
              'sub-category',
              idSubCategory,
              'page',
              pageSubcategory,
              'topic',
              topic.id,
              'page',
              topic.posts.meta.totalPages,
            ])
            .then();
        }
      }),
      refreshMap(topic => {
        if (topic.hasNewPosts && page === topic.posts.meta.totalPages) {
          return topicService.read(idSubCategory, idTopic);
        }
        return of(null);
      })
    );
  };
}

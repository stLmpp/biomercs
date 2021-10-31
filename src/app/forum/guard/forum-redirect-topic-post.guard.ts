import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TopicService } from '../service/topic.service';
import { map, Observable } from 'rxjs';
import { RouteParamEnum } from '@model/enum/route-param.enum';

@Injectable({ providedIn: 'root' })
export class ForumRedirectTopicPostGuard implements CanActivate {
  constructor(private topicService: TopicService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const idCategory = +(route.paramMap.get(RouteParamEnum.idCategory) ?? -1);
    const idSubCategory = +(route.paramMap.get(RouteParamEnum.idSubCategory) ?? -1);
    const idTopic = +(route.paramMap.get(RouteParamEnum.idTopic) ?? -1);
    const idPost = +(route.paramMap.get(RouteParamEnum.idPost) ?? -1);
    return this.topicService
      .getPageTopicPost(idSubCategory, idTopic, idPost)
      .pipe(
        map(response =>
          this.router.createUrlTree(
            [
              '/forum',
              'category',
              idCategory,
              'sub-category',
              idSubCategory,
              'page',
              response.pageTopic,
              'topic',
              idTopic,
              'page',
              response.pagePost,
            ],
            { fragment: '' + idPost }
          )
        )
      );
  }
}

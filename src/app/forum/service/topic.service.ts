import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopicWithPosts } from '@model/forum/topic';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class TopicService {
  constructor(private http: HttpClient) {}

  readonly endPoint = 'forum/topic';

  increaseViews(idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idTopic}/increase-views`, undefined);
  }

  getByIdWithPosts(idTopic: number, page: number, limit: number): Observable<TopicWithPosts> {
    const params = new HttpParams({ page, limit });
    return this.http.get<TopicWithPosts>(`${this.endPoint}/${idTopic}/with/posts`, { params });
  }
}
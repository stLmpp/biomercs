import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TopicAddDto, TopicPostPage, TopicWithPosts } from '@model/forum/topic';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class TopicService {
  constructor(private http: HttpClient) {}

  getEndPoint(idSubCategory: number): string {
    return `forum/sub-category/${idSubCategory}/topic`;
  }

  increaseViews(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}/increase-views`, undefined);
  }

  getByIdWithPosts(idSubCategory: number, idTopic: number, page: number, limit: number): Observable<TopicWithPosts> {
    const params = new HttpParams({ page, limit });
    return this.http.get<TopicWithPosts>(`${this.getEndPoint(idSubCategory)}/${idTopic}/with/posts`, { params });
  }

  delete(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.delete<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}`);
  }

  lock(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}/lock`, undefined);
  }

  unlock(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}/unlock`, undefined);
  }

  pin(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}/pin`, undefined);
  }

  unpin(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}/unpin`, undefined);
  }

  add(idSubCategory: number, dto: TopicAddDto): Observable<{ idTopic: number; page: number }> {
    return this.http.post<{ idTopic: number; page: number }>(`${this.getEndPoint(idSubCategory)}`, dto);
  }

  getPageTopicPost(idSubCategory: number, idTopic: number, idPost: number): Observable<TopicPostPage> {
    return this.http.get<TopicPostPage>(`${this.getEndPoint(idSubCategory)}/${idTopic}/page/with/post/${idPost}`);
  }

  read(idSubCategory: number, idTopic: number): Observable<void> {
    return this.http.put<void>(`${this.getEndPoint(idSubCategory)}/${idTopic}/read`, undefined);
  }

  move(idSubCategory: number, idTopic: number, idSubCategoryTo: number): Observable<number> {
    return this.http.put<number>(`${this.getEndPoint(idSubCategory)}/${idTopic}/move/${idSubCategoryTo}`, undefined);
  }
}

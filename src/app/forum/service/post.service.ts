import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostAddDto, PostUpdateDto } from '@model/forum/post';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  getEndPoint(idTopic: number): string {
    return `forum/topic/${idTopic}/post`;
  }

  update(idTopic: number, idPost: number, dto: PostUpdateDto): Observable<Post> {
    return this.http.patch<Post>(`${this.getEndPoint(idTopic)}/${idPost}`, dto);
  }

  delete(idTopic: number, idPost: number): Observable<void> {
    return this.http.delete<void>(`${this.getEndPoint(idTopic)}/${idPost}`);
  }

  add(idTopic: number, dto: PostAddDto): Observable<Post> {
    return this.http.post<Post>(`${this.getEndPoint(idTopic)}`, dto);
  }
}

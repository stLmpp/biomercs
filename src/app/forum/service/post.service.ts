import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, PostAddDto, PostUpdateDto } from '@model/forum/post';

@Injectable({ providedIn: 'root' })
export class PostService {
  private http = inject(HttpClient);


  getEndPoint(idSubCategory: number, idTopic: number): string {
    return `forum/sub-category/${idSubCategory}/topic/${idTopic}/post`;
  }

  update(idSubCategory: number, idTopic: number, idPost: number, dto: PostUpdateDto): Observable<void> {
    return this.http.patch<void>(`${this.getEndPoint(idSubCategory, idTopic)}/${idPost}`, dto);
  }

  delete(idSubCategory: number, idTopic: number, idPost: number): Observable<void> {
    return this.http.delete<void>(`${this.getEndPoint(idSubCategory, idTopic)}/${idPost}`);
  }

  add(idSubCategory: number, idTopic: number, dto: PostAddDto): Observable<Post> {
    return this.http.post<Post>(`${this.getEndPoint(idSubCategory, idTopic)}`, dto);
  }
}

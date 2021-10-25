import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pagination } from '@model/pagination';
import { User, UserOnline } from '@model/user';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  readonly endPoint = 'user';

  banUser(idUser: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idUser}/ban`, undefined);
  }

  unbanUser(idUser: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idUser}/unban`, undefined);
  }

  search(term: string, page: number, limit: number): Observable<Pagination<User>> {
    const params = new HttpParams({ term, page, limit });
    return this.http.get<Pagination<User>>(`${this.endPoint}/search`, { params });
  }

  getOnline(): Observable<UserOnline[]> {
    return this.http.get<UserOnline[]>(`${this.endPoint}/online`);
  }
}

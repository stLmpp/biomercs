import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModeratorAddAndDeleteDto, ModeratorWithInfo } from '@model/forum/moderator';

@Injectable({ providedIn: 'root' })
export class ModeratorService {
  constructor(private http: HttpClient) {}

  readonly endPoint = 'forum/moderator';

  getAll(): Observable<ModeratorWithInfo[]> {
    return this.http.get<ModeratorWithInfo[]>(this.endPoint);
  }

  andAndDelete(dto: ModeratorAddAndDeleteDto): Observable<ModeratorWithInfo[]> {
    return this.http.put<ModeratorWithInfo[]>(`${this.endPoint}/add-and-delete`, dto);
  }
}

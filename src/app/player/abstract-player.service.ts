import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayerStore } from './player.store';
import { Observable } from 'rxjs';
import { Player, PlayerAdd, PlayerUpdate } from '@model/player';
import { tap } from 'rxjs/operators';
import { Pagination } from '@model/pagination';
import { HttpParams } from '@util/http-params';

@Injectable({ providedIn: 'root' })
export class AbstractPlayerService {
  constructor(protected http: HttpClient, protected playerStore: PlayerStore) {}

  endPoint = 'player';

  getById(idPlayer: number): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/${idPlayer}`).pipe(
      tap(player => {
        this.playerStore.upsert(idPlayer, player);
      })
    );
  }

  getIdByPersonaName(personaName: string): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/persona-name/${personaName}/id`);
  }

  getIdByIdUser(idUser: number): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/user/${idUser}/id`);
  }

  getAuth(): Observable<Player> {
    return this.http.get<Player>(`${this.endPoint}/auth`).pipe(
      tap(player => {
        this.playerStore.upsert(player.id, player);
      })
    );
  }

  update(idPlayer: number, dto: PlayerUpdate): Observable<Player> {
    return this.http.patch<Player>(`${this.endPoint}/${idPlayer}`, dto).pipe(
      tap(player => {
        this.playerStore.upsert(idPlayer, player);
      })
    );
  }

  search(personaName: string, page: number, limit: number): Observable<Pagination<Player>> {
    const params = new HttpParams({ personaName, page, limit });
    return this.http.get<Pagination<Player>>(`${this.endPoint}/search`, { params }).pipe(
      tap(({ items }) => {
        this.playerStore.upsert(items);
      })
    );
  }

  personaNameExists(personaName: string): Observable<boolean> {
    const params = new HttpParams({ personaName }, true);
    return this.http.get<boolean>(`${this.endPoint}/exists`, { params });
  }

  create(dto: PlayerAdd): Observable<Player> {
    return this.http.post<Player>(this.endPoint, dto);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GameStore } from './game.store';
import { httpCache } from '../../operators/http-cache';
import { Game } from '@model/game';

@Injectable({ providedIn: 'root' })
export class GameService {
  constructor(private http: HttpClient, private gameStore: GameStore) {}

  endPoint = 'game';

  findByIdPlatform(idPlatform: number): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.endPoint}/platform/${idPlatform}`).pipe(
      httpCache(this.gameStore, [idPlatform]),
      tap(games => {
        this.gameStore.upsert(games);
      })
    );
  }
}

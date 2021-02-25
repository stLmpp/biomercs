import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { StageStore } from './stage.store';
import { httpCache } from '../../operators/http-cache';
import { Stage } from '@model/stage';

@Injectable({ providedIn: 'root' })
export class StageService {
  constructor(private http: HttpClient, private stageStore: StageStore) {}

  endPoint = 'stage';

  findByIdPlatformGameMiniGameMode(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<Stage[]> {
    return this.http
      .get<Stage[]>(`${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}`)
      .pipe(
        httpCache(this.stageStore, [idPlatform, idGame, idMiniGame, idMode]),
        tap(stages => {
          this.stageStore.upsert(stages);
        })
      );
  }
}

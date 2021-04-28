import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlayerStore } from './player.store';
import { tap } from 'rxjs/operators';
import { Player, PlayerAdd, PlayerUpdate } from '@model/player';
import { HttpParams } from '@util/http-params';
import { ModalRef } from '@shared/components/modal/modal-ref';
import type {
  PlayerChangeRequestsModalComponent,
  PlayerChangeRequestsModalData,
} from './player-change-requests/player-change-requests-modal/player-change-requests-modal.component';
import { ModalService } from '@shared/components/modal/modal.service';
import { ScoreChangeRequestsPaginationVW } from '@model/score-change-request';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private http: HttpClient, private playerStore: PlayerStore, private modalService: ModalService) {}

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

  search(personaName: string): Observable<Player[]> {
    const params = new HttpParams({ personaName });
    return this.http
      .get<Player[]>(`${this.endPoint}/search`, { params })
      .pipe(
        tap(players => {
          this.playerStore.upsert(players);
        })
      );
  }

  async openPlayerChangeRequestsModal(
    data: PlayerChangeRequestsModalData
  ): Promise<
    ModalRef<PlayerChangeRequestsModalComponent, PlayerChangeRequestsModalData, ScoreChangeRequestsPaginationVW>
  > {
    return this.modalService.openLazy(
      () =>
        import('./player-change-requests/player-change-requests-modal/player-change-requests-modal.component').then(
          m => m.PlayerChangeRequestsModalComponent
        ),
      { data, disableClose: true, minWidth: '60vw' }
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

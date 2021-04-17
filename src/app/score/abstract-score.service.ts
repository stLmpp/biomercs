import {
  ScoreAdd,
  ScoreChangeRequestsFulfilDto,
  ScoreTopTableVW,
  ScoreTopTableWorldRecord,
  ScoreVW,
} from '@model/score';
import { Observable } from 'rxjs';
import { OrderByDirection } from 'st-utils';
import { ScoreApprovalAdd, ScoreApprovalVW } from '@model/score-approval';
import { HttpParams } from '@util/http-params';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ScoreChangeRequest, ScoreChangeRequestsPaginationVW } from '@model/score-change-request';
import { HeaderState, HeaderStore } from '../header/header.store';
import { tap } from 'rxjs/operators';

export abstract class AbstractScoreService {
  protected constructor(private http: HttpClient, private headerStore: HeaderStore) {}

  endPoint = 'score';

  private _subtractApprovalCount(playerMode: boolean): void {
    const path = playerMode ? 'player' : 'admin';
    const key = `${path}ApprovalCount` as keyof HeaderState;
    this.headerStore.updateState(state => ({ ...state, [key]: state[key] - 1 }));
  }

  add(dto: ScoreAdd): Observable<ScoreVW> {
    return this.http.post<ScoreVW>(this.endPoint, dto);
  }

  findById(idScore: number): Observable<ScoreVW> {
    return this.http.get<ScoreVW>(`${this.endPoint}/${idScore}`);
  }

  findLeaderboards(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    page: number,
    limit?: number
  ): Observable<ScoreTopTableVW> {
    const params = new HttpParams({ page, limit }, true);
    return this.http.get<ScoreTopTableVW>(
      `${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}/leaderboards`,
      { params }
    );
  }

  findApproval(
    playerMode: boolean,
    idPlatform: number,
    page: number,
    idGame?: number | null,
    idMiniGame?: number | null,
    idMode?: number | null,
    idStage?: number | null,
    limit?: number,
    orderBy?: string | null,
    orderByDirection?: OrderByDirection | null
  ): Observable<ScoreApprovalVW> {
    const params = new HttpParams(
      { idPlatform, page, idGame, idMiniGame, idMode, limit, orderBy, orderByDirection, idStage },
      true
    );
    const path = playerMode ? 'player' : 'admin';
    return this.http.get<ScoreApprovalVW>(`${this.endPoint}/approval/${path}`, { params });
  }

  approveOrReject(
    playerMode: boolean,
    idScore: number,
    action: ScoreApprovalActionEnum,
    payload: ScoreApprovalAdd
  ): Observable<void> {
    const path = playerMode ? 'player' : 'admin';
    return this.http.post<void>(`${this.endPoint}/${idScore}/${action.toLowerCase()}/${path}`, payload).pipe(
      tap(() => {
        this._subtractApprovalCount(playerMode);
      })
    );
  }

  findChangeRequests(page: number, limit?: number): Observable<ScoreChangeRequestsPaginationVW> {
    const params = new HttpParams({ page, limit }, true);
    return this.http.get<ScoreChangeRequestsPaginationVW>(`${this.endPoint}/player/change-requests`, { params });
  }

  requestChanges(idScore: number, changes: string[]): Observable<ScoreChangeRequest[]> {
    return this.http.post<ScoreChangeRequest[]>(`${this.endPoint}/${idScore}/request-changes`, changes).pipe(
      tap(() => {
        this._subtractApprovalCount(false);
      })
    );
  }

  findApprovalCount(playerMode: boolean): Observable<number> {
    const path = playerMode ? 'player' : 'admin';
    return this.http.get<number>(`${this.endPoint}/approval/${path}/count`).pipe(
      tap(count => {
        const key = `${path}ApprovalCount` as keyof HeaderState;
        this.headerStore.updateState({ [key]: count });
      })
    );
  }

  findChangeRequestsCount(): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/player/change-requests/count`).pipe(
      tap(count => {
        this.headerStore.updateState({ playerRequestChangesCount: count });
      })
    );
  }

  fulfilChangeRequests(idScore: number, dto: ScoreChangeRequestsFulfilDto): Observable<boolean> {
    return this.http.patch<boolean>(`${this.endPoint}/${idScore}/fulfil-change-requests`, dto).pipe(
      tap(hasAnyRequestChange => {
        if (!hasAnyRequestChange) {
          this.headerStore.updateState(state => ({
            ...state,
            playerRequestChangesCount: state.playerRequestChangesCount - 1,
            adminApprovalCount: state.adminApprovalCount + 1,
          }));
        }
      })
    );
  }

  findWorldRecordTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<ScoreTopTableWorldRecord> {
    const params = new HttpParams({ idPlatform, idGame, idMiniGame, idMode });
    return this.http.get<ScoreTopTableWorldRecord>(`${this.endPoint}/world-record/table`, { params });
  }
}

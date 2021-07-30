import {
  Score,
  ScoreAdd,
  ScoreChangeRequestsFulfilDto,
  ScoreGatewayEvents,
  ScoreSearch,
  ScoreTopTable,
  ScoreTopTableWorldRecord,
} from '@model/score';
import { auditTime, Observable, tap } from 'rxjs';
import { OrderByDirection } from 'st-utils';
import { ScoreApprovalAdd, ScoreApprovalPagination } from '@model/score-approval';
import { HttpParams } from '@util/http-params';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ScoreChangeRequest, ScoreChangeRequestsPagination } from '@model/score-change-request';
import { HeaderStore } from '../header/header.store';
import { SocketIOService } from '@shared/services/socket-io/socket-io.service';
import { Pagination } from '@model/pagination';
import { ScoreGroupedByStatus } from '@model/score-grouped-by-status';

export abstract class AbstractScoreService {
  protected constructor(
    private http: HttpClient,
    private headerStore: HeaderStore,
    private socketIOService: SocketIOService
  ) {}

  private readonly _socketConnection = this.socketIOService.createConnection('score');

  readonly endPoint = 'score';

  add(dto: ScoreAdd): Observable<Score> {
    return this.http.post<Score>(this.endPoint, dto);
  }

  findById(idScore: number): Observable<Score> {
    return this.http.get<Score>(`${this.endPoint}/${idScore}`);
  }

  findLeaderboards(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    page: number,
    limit?: number
  ): Observable<ScoreTopTable> {
    const params = new HttpParams({ page, limit }, true);
    return this.http.get<ScoreTopTable>(
      `${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}/leaderboards`,
      { params }
    );
  }

  findWorldRecordTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number
  ): Observable<ScoreTopTableWorldRecord> {
    return this.http.get<ScoreTopTableWorldRecord>(
      `${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}/world-record/table`
    );
  }

  findApproval(
    idPlatform: number,
    page: number,
    idGame?: number | null,
    idMiniGame?: number | null,
    idMode?: number | null,
    idStage?: number | null,
    limit?: number,
    orderBy?: string | null,
    orderByDirection?: OrderByDirection | null
  ): Observable<ScoreApprovalPagination> {
    const params = new HttpParams(
      { idPlatform, page, idGame, idMiniGame, idMode, limit, orderBy, orderByDirection, idStage },
      true
    );
    return this.http.get<ScoreApprovalPagination>(`${this.endPoint}/approval`, { params });
  }

  approveOrReject(idScore: number, action: ScoreApprovalActionEnum, payload: ScoreApprovalAdd): Observable<void> {
    return this.http.post<void>(`${this.endPoint}/${idScore}/${action.toLowerCase()}`, payload);
  }

  findChangeRequests(page: number, limit?: number): Observable<ScoreChangeRequestsPagination> {
    const params = new HttpParams({ page, limit }, true);
    return this.http.get<ScoreChangeRequestsPagination>(`${this.endPoint}/player/change-requests`, { params });
  }

  requestChanges(idScore: number, changes: string[]): Observable<ScoreChangeRequest[]> {
    return this.http.post<ScoreChangeRequest[]>(`${this.endPoint}/${idScore}/request-changes`, changes);
  }

  findApprovalCount(): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/approval/count`).pipe(
      tap(adminApprovalCount => {
        this.headerStore.updateState({ adminApprovalCount });
      })
    );
  }

  findChangeRequestsCount(): Observable<number> {
    return this.http.get<number>(`${this.endPoint}/player/change-requests/count`).pipe(
      tap(playerRequestChangesCount => {
        this.headerStore.updateState({ playerRequestChangesCount });
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

  onUpdateCountApprovals(): Observable<void> {
    return this._socketConnection.fromEvent<void>(ScoreGatewayEvents.updateCountApprovals).pipe(auditTime(5000));
  }

  search(dto: ScoreSearch): Observable<Pagination<Score>> {
    const params = new HttpParams(dto, true);
    return this.http.get<Pagination<Score>>(`${this.endPoint}/search`, { params });
  }

  findRejectedAndPendingScoresByIdUser(): Observable<ScoreGroupedByStatus[]> {
    return this.http.get<ScoreGroupedByStatus[]>(`${this.endPoint}/player/rejected-and-pending`);
  }

  cancel(idScore: number): Observable<void> {
    return this.http.put<void>(`${this.endPoint}/${idScore}/cancel`, undefined);
  }
}

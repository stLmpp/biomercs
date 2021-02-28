import { ScoreAdd, ScoreTopTableVW, ScoreVW } from '@model/score';
import { Observable } from 'rxjs';
import { OrderByDirection } from 'st-utils';
import { ScoreApprovalAdd, ScoreApprovalVW } from '@model/score-approval';
import { HttpParams } from '@util/http-params';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';

export abstract class AbstractScoreService {
  protected constructor(private http: HttpClient) {}

  endPoint = 'score';

  add(dto: ScoreAdd): Observable<ScoreVW> {
    return this.http.post<ScoreVW>(this.endPoint, dto);
  }

  findById(idScore: number): Observable<ScoreVW> {
    return this.http.get<ScoreVW>(`${this.endPoint}/${idScore}`);
  }

  findTopScoresTable(
    idPlatform: number,
    idGame: number,
    idMiniGame: number,
    idMode: number,
    page: number,
    limit?: number
  ): Observable<ScoreTopTableVW> {
    const params = new HttpParams({ page, limit }, true);
    return this.http.get<ScoreTopTableVW>(
      `${this.endPoint}/platform/${idPlatform}/game/${idGame}/mini-game/${idMiniGame}/mode/${idMode}/score-table`,
      { params }
    );
  }

  findApprovalAdmin(
    idPlatform: number,
    page: number,
    idGame?: number | null,
    idMiniGame?: number | null,
    idMode?: number | null,
    limit?: number,
    orderBy?: string | null,
    orderByDirection?: OrderByDirection | null
  ): Observable<ScoreApprovalVW> {
    const params = new HttpParams(
      { idPlatform, page, idGame, idMiniGame, idMode, limit, orderBy, orderByDirection },
      true
    );
    return this.http.get<ScoreApprovalVW>(`${this.endPoint}/approval/admin`, { params });
  }

  findApprovalPlayer(
    idPlatform: number,
    page: number,
    idGame?: number,
    idMiniGame?: number,
    idMode?: number,
    limit?: number,
    orderBy?: string | null,
    orderByDirection?: OrderByDirection | null
  ): Observable<ScoreApprovalVW> {
    const params = new HttpParams(
      { idPlatform, page, idGame, idMiniGame, idMode, limit, orderBy, orderByDirection },
      true
    );
    return this.http.get<ScoreApprovalVW>(`${this.endPoint}/approval/player`, { params });
  }

  approveOrRejectAdmin(idScore: number, action: ScoreApprovalActionEnum, payload: ScoreApprovalAdd): Observable<void> {
    return this.http.post<void>(`${this.endPoint}/${idScore}/${action.toLowerCase()}/admin`, payload);
  }

  approveOrRejectPlayer(idScore: number, action: ScoreApprovalActionEnum, payload: ScoreApprovalAdd): Observable<void> {
    return this.http.post<void>(`${this.endPoint}/${idScore}/${action.toLowerCase()}/player`, payload);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { Observable, of } from 'rxjs';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { ScoreApprovalMotiveStore } from '@shared/services/score-approval-motive/score-approval-motive.store';
import { ScoreApprovalMotiveQuery } from '@shared/services/score-approval-motive/score-approval-motive.query';
import { HttpParams } from '@util/http-params';
import { tap } from 'rxjs/operators';
import { setLoading } from '@stlmpp/store';

@Injectable({ providedIn: 'root' })
export class ScoreApprovalMotiveService {
  constructor(
    private http: HttpClient,
    private scoreApprovalMotiveStore: ScoreApprovalMotiveStore,
    private scoreApprovalMotiveQuery: ScoreApprovalMotiveQuery
  ) {}

  endPoint = 'score-approval-motive';

  getByAction(action: ScoreApprovalActionEnum): Observable<ScoreApprovalMotive[]> {
    if (this.scoreApprovalMotiveStore.hasCache()) {
      const cached = this.scoreApprovalMotiveQuery.getByAction(action);
      if (cached.length) {
        return of(cached.values);
      }
    }
    const params = new HttpParams({ action });
    return this.http
      .get<ScoreApprovalMotive[]>(`${this.endPoint}/action`, { params })
      .pipe(
        setLoading(this.scoreApprovalMotiveStore),
        tap(scoreApprovalMotives => {
          this.scoreApprovalMotiveStore.upsert(scoreApprovalMotives);
          this.scoreApprovalMotiveStore.setHasCache(true);
        })
      );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { Observable, tap } from 'rxjs';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { ScoreApprovalMotiveStore } from '@shared/services/score-approval-motive/score-approval-motive.store';
import { HttpParams } from '@util/http-params';
import { setLoading } from '@stlmpp/store';
import { httpCache } from '@shared/operators/http-cache';

@Injectable({ providedIn: 'root' })
export class ScoreApprovalMotiveService {
  constructor(private http: HttpClient, private scoreApprovalMotiveStore: ScoreApprovalMotiveStore) {}

  readonly endPoint = 'score-approval-motive';

  getByAction(action: ScoreApprovalActionEnum): Observable<ScoreApprovalMotive[]> {
    const params = new HttpParams({ action });
    return this.http.get<ScoreApprovalMotive[]>(`${this.endPoint}/action`, { params }).pipe(
      httpCache(this.scoreApprovalMotiveStore, [action]),
      setLoading(this.scoreApprovalMotiveStore),
      tap(scoreApprovalMotives => {
        this.scoreApprovalMotiveStore.upsert(scoreApprovalMotives);
        this.scoreApprovalMotiveStore.setHasCache(true);
      })
    );
  }
}

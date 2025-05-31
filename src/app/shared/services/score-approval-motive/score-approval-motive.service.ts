import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { Observable } from 'rxjs';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { HttpParams } from '@util/http-params';
import { CacheService } from '@shared/cache/cache';

@Injectable({ providedIn: 'root' })
export class ScoreApprovalMotiveService {
  private http = inject(HttpClient);
  private cacheService = inject(CacheService);

  private readonly _cache = this.cacheService.createCache();

  readonly endPoint = 'score-approval-motive';

  getByAction(action: ScoreApprovalActionEnum): Observable<ScoreApprovalMotive[]> {
    const params = new HttpParams({ action });
    return this.http.get<ScoreApprovalMotive[]>(`${this.endPoint}/action`, { params }).pipe(this._cache.use(action));
  }
}

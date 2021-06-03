import { Injectable } from '@angular/core';
import { EntityQuery, StMapView } from '@stlmpp/store';
import {
  ScoreApprovalMotiveState,
  ScoreApprovalMotiveStore,
} from '@shared/services/score-approval-motive/score-approval-motive.store';
import { ScoreApprovalActionEnum } from '@model/enum/score-approval-action.enum';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScoreApprovalMotiveQuery extends EntityQuery<ScoreApprovalMotiveState> {
  constructor(scoreApprovalMotiveStore: ScoreApprovalMotiveStore) {
    super(scoreApprovalMotiveStore);
  }

  getByAction(action: ScoreApprovalActionEnum): StMapView<ScoreApprovalMotive> {
    return this.getAll().filter(scoreApprovalMotive => scoreApprovalMotive.action === action);
  }

  selectByAction(action: ScoreApprovalActionEnum): Observable<StMapView<ScoreApprovalMotive>> {
    return this.selectAll({ filterBy: ['action', action] });
  }
}

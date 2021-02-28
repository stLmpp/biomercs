import { EntityState, EntityStore } from '@stlmpp/store';
import { ScoreApprovalMotive } from '@model/score-approval-motive';
import { Injectable } from '@angular/core';
import { environment } from '@environment/environment';

export type ScoreApprovalMotiveState = EntityState<ScoreApprovalMotive>;

@Injectable({ providedIn: 'root' })
export class ScoreApprovalMotiveStore extends EntityStore<ScoreApprovalMotiveState> {
  constructor() {
    super({ name: 'score-approval-motive', cache: environment.cacheTimeout });
  }
}

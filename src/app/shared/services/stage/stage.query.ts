import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { StageState, StageStore } from './stage.store';

@Injectable({ providedIn: 'root' })
export class StageQuery extends EntityQuery<StageState> {
  constructor(stageStore: StageStore) {
    super(stageStore);
  }
}

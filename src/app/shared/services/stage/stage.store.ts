import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { Stage } from '@model/stage';

export type StageState = EntityState<Stage>;

@Injectable({ providedIn: 'root' })
export class StageStore extends EntityStore<StageState> {
  constructor() {
    super({ name: 'stage' });
  }
}

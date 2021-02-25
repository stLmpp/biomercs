import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { RegionState, RegionStore } from './region.store';

@Injectable({ providedIn: 'root' })
export class RegionQuery extends EntityQuery<RegionState> {
  constructor(regionStore: RegionStore) {
    super(regionStore);
  }
}

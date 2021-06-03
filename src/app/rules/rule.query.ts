import { Injectable } from '@angular/core';
import { EntityQuery } from '@stlmpp/store';
import { RuleState, RuleStore } from './rule.store';

@Injectable({ providedIn: 'root' })
export class RuleQuery extends EntityQuery<RuleState> {
  constructor(ruleStore: RuleStore) {
    super(ruleStore);
  }
}

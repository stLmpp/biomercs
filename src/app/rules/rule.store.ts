import { Injectable } from '@angular/core';
import { EntityState, EntityStore } from '@stlmpp/store';
import { Rule } from '@model/rule';
import { environment } from '@environment/environment';

export type RuleState = EntityState<Rule>;

@Injectable({ providedIn: 'root' })
export class RuleStore extends EntityStore<RuleState> {
  constructor() {
    super({ name: 'rule', cache: environment.cacheTimeout });
  }
}

import { trackByFactory } from '@stlmpp/utils';

export interface Rule {
  id: number;
  description: string;
  order: number;
}

export interface RuleAdd extends Omit<Rule, 'id'> {}

export interface RuleUpdate {
  description?: string;
  order?: number;
}

export interface RuleUpsert extends RuleAdd {
  id?: number;
  deleted: boolean;
}

export const trackByRule = trackByFactory<Rule>('id');

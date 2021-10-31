export interface Rule {
  id: number;
  description: string;
  order: number;
  type: RuleTypeEnum;
}

export interface RuleAdd extends Omit<Rule, 'id'> {}

export interface RuleUpsert extends RuleAdd {
  id?: number;
  deleted: boolean;
}

export enum RuleTypeEnum {
  Main = 'Main',
  Forum = 'Forum',
}

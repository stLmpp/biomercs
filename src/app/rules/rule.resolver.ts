import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Rule } from '@model/rule';
import { RuleService } from './rule.service';

export function ruleResolver(): ResolveFn<Rule[]> {
  return () => inject(RuleService).get();
}

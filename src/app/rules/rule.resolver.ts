import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Rule } from '@model/rule';
import { RuleService } from './rule.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuleResolver implements Resolve<Rule[]> {
  constructor(private ruleService: RuleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Rule[]> | Promise<Rule[]> | Rule[] {
    return this.ruleService.get();
  }
}

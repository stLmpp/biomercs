import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Rule } from '@model/rule';
import { RuleService } from './rule.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RuleResolver  {
  private ruleService = inject(RuleService);


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Rule[]> | Promise<Rule[]> | Rule[] {
    return this.ruleService.get();
  }
}

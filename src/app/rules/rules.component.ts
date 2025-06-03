import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { Rule, RuleTypeEnum } from '@model/rule';
import { ActivatedRoute } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { Control } from '@stlmpp/control';
import { combineLatest, map } from 'rxjs';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class RulesComponent {
  constructor(private authQuery: AuthQuery, private activatedRoute: ActivatedRoute) {}

  readonly trackBy = trackByFactory<Rule>('id');
  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly ruleTypeEnum = RuleTypeEnum;
  readonly ruleTypeControl = new Control(RuleTypeEnum.Main);

  readonly rules$ = combineLatest([
    this.activatedRoute.data.pipe(map(data => data[RouteDataEnum.rules] as Rule[])),
    this.ruleTypeControl.value$,
  ]).pipe(map(([rules, ruleType]) => rules.filter(rule => rule.type === ruleType)));
}

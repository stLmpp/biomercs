import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RuleService } from './rule.service';
import { RuleQuery } from './rule.query';
import { trackByRule } from '@model/rule';
import { AuthQuery } from '../auth/auth.query';

@Component({
  selector: 'bio-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RulesComponent {
  constructor(private ruleService: RuleService, private ruleQuery: RuleQuery, private authQuery: AuthQuery) {}

  isAdmin$ = this.authQuery.isAdmin$;
  rules$ = this.ruleQuery.all$;
  trackByRule = trackByRule;
}
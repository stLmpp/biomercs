import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RuleService } from './rule.service';
import { RuleQuery } from './rule.query';
import { AuthQuery } from '../auth/auth.query';

@Component({
  selector: 'bio-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class RulesComponent {
  constructor(private ruleService: RuleService, private ruleQuery: RuleQuery, private authQuery: AuthQuery) {}

  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly rules$ = this.ruleQuery.all$;
  readonly trackByRule = this.ruleQuery.trackBy;
}

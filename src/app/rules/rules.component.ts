import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { Rule, RuleTypeEnum } from '@model/rule';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackById } from '@util/track-by';
import { Control, StControlCommonModule, StControlModule } from '@stlmpp/control';
import { combineLatest, map } from 'rxjs';
import { CardComponent } from '../shared/components/card/card.component';
import { CardTitleDirective } from '../shared/components/card/card-title.directive';
import { CardContentDirective } from '../shared/components/card/card-content.directive';
import { FormFieldComponent } from '../shared/components/form/form-field.component';
import { SelectComponent } from '../shared/components/select/select.component';
import { OptionComponent } from '../shared/components/select/option.component';
import { CardActionsDirective } from '../shared/components/card/card-actions.directive';
import { ButtonComponent } from '../shared/components/button/button.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'bio-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
  imports: [
    CardComponent,
    CardTitleDirective,
    CardContentDirective,
    FormFieldComponent,
    SelectComponent,
    StControlCommonModule,
    StControlModule,
    OptionComponent,
    CardActionsDirective,
    ButtonComponent,
    RouterLink,
    AsyncPipe,
  ],
})
export class RulesComponent {
  constructor(private authQuery: AuthQuery, private activatedRoute: ActivatedRoute) {}

  readonly trackBy = trackById;
  readonly isAdmin$ = this.authQuery.isAdmin$;
  readonly ruleTypeEnum = RuleTypeEnum;
  readonly ruleTypeControl = new Control(RuleTypeEnum.Main);

  readonly rules$ = combineLatest([
    this.activatedRoute.data.pipe(map(data => data[RouteDataEnum.rules] as Rule[])),
    this.ruleTypeControl.value$,
  ]).pipe(map(([rules, ruleType]) => rules.filter(rule => rule.type === ruleType)));
}

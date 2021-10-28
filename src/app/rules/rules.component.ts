import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthQuery } from '../auth/auth.query';
import { Rule } from '@model/rule';
import { ActivatedRoute } from '@angular/router';
import { RouteDataEnum } from '@model/enum/route-data.enum';
import { trackById } from '@util/track-by';

@Component({
  selector: 'bio-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'center-container' },
})
export class RulesComponent {
  constructor(private authQuery: AuthQuery, private activatedRoute: ActivatedRoute) {}

  readonly rules: Rule[] = this.activatedRoute.snapshot.data[RouteDataEnum.rules];
  readonly trackBy = trackById;
  readonly isAdmin$ = this.authQuery.isAdmin$;
}

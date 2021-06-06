import { ChangeDetectionStrategy, Component, Optional } from '@angular/core';
import { BadgeBase, BioBadgeConfig } from '@shared/components/badge/badge';

@Component({
  selector: 'bio-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'badge' },
})
export class BadgeComponent extends BadgeBase {
  constructor(@Optional() bioBadgeConfig: BioBadgeConfig) {
    super(bioBadgeConfig);
  }
}

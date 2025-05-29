import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BadgeBase, BioBadgeConfig } from '@shared/components/badge/badge';

@Component({
  selector: 'bio-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'badge' },
})
export class BadgeComponent extends BadgeBase {
  constructor() {
    const bioBadgeConfig = inject(BioBadgeConfig, { optional: true });

    super(bioBadgeConfig);
  }
}

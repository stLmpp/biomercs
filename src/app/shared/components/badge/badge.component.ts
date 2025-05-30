import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeBase } from '@shared/components/badge/badge';

@Component({
  selector: 'bio-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'badge' },
})
export class BadgeComponent extends BadgeBase {}

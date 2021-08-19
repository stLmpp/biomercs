import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bio-notifications-icon',
  templateUrl: './notifications-icon.component.html',
  styleUrls: ['./notifications-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsIconComponent {}

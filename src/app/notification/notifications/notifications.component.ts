import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bio-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationsComponent {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsIconComponent } from './notifications-icon/notifications-icon.component';

@NgModule({
  declarations: [NotificationsComponent, NotificationsIconComponent],
  imports: [CommonModule],
})
export class NotificationModule {}

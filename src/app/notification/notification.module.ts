import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsIconComponent } from './notifications-icon/notifications-icon.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { BadgeModule } from '@shared/components/badge/badge.module';
import { ListModule } from '@shared/components/list/list.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgLetModule } from '@stlmpp/utils';
import { MenuModule } from '@shared/components/menu/menu.module';

@NgModule({
  declarations: [NotificationsComponent, NotificationsIconComponent],
  imports: [
    CommonModule,
    ButtonModule,
    BadgeModule,
    ListModule,
    ScrollingModule,
    OverlayModule,
    NgLetModule,
    MenuModule,
  ],
  exports: [NotificationsIconComponent, NotificationsComponent],
})
export class NotificationModule {}

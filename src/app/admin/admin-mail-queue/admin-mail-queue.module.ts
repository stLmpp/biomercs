import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminMailQueueRoutingModule } from './admin-mail-queue-routing.module';
import { AdminMailQueueComponent } from './admin-mail-queue.component';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  imports: [CommonModule, AdminMailQueueRoutingModule, CardModule, ButtonModule, AdminMailQueueComponent],
})
export class AdminMailQueueModule {}

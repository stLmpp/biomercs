import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { CardModule } from '@shared/components/card/card.module';
import { BadgeModule } from '@shared/components/badge/badge.module';

@NgModule({
  imports: [CommonModule, AdminRoutingModule, CardModule, BadgeModule, AdminComponent],
})
export class AdminModule {}

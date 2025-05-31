import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { IconModule } from '@shared/components/icon/icon.module';
import { BadgeModule } from '@shared/components/badge/badge.module';
import { CardModule } from '@shared/components/card/card.module';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, IconModule, BadgeModule, CardModule, HomeComponent],
})
export class HomeModule {}

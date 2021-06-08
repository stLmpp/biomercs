import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { TitleModule } from '@shared/title/title.module';
import { CardModule } from '@shared/components/card/card.module';

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, AdminRoutingModule, TitleModule, CardModule],
})
export class AdminModule {}

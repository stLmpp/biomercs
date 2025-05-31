import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
import { CardModule } from '@shared/components/card/card.module';
import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  imports: [CommonModule, NotFoundRoutingModule, CardModule, ButtonModule, NotFoundComponent],
})
export class NotFoundModule {}

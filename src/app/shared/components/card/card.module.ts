import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { CardTitleDirective } from './card-title.directive';
import { CardContentDirective } from './card-content.directive';
import { CardActionsDirective } from './card-actions.directive';
import { CardSubtitleDirective } from './card-subtitle.directive';
import { ButtonModule } from '@shared/components/button/button.module';
import { IconModule } from '@shared/components/icon/icon.module';

const DECLARATIONS = [
  CardComponent,
  CardTitleDirective,
  CardContentDirective,
  CardActionsDirective,
  CardSubtitleDirective,
];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [CommonModule, ButtonModule, IconModule],
  exports: [...DECLARATIONS],
})
export class CardModule {}

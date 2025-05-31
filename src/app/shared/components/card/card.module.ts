import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { CardTitleDirective } from './card-title.directive';
import { CardContentDirective } from './card-content.directive';
import { CardActionsDirective } from './card-actions.directive';
import { CardSubtitleDirective } from './card-subtitle.directive';
import { IconModule } from '@shared/components/icon/icon.module';
import { CollapseModule } from '@shared/components/collapse/collapse.module';
import { CardMenusDirective } from './card-menu/card-menus.directive';
import { CardMenuDirective } from './card-menu/card-menu.directive';

const DECLARATIONS = [
  CardComponent,
  CardTitleDirective,
  CardContentDirective,
  CardActionsDirective,
  CardSubtitleDirective,
  CardMenusDirective,
  CardMenuDirective,
];

const MODULES = [CommonModule, IconModule, CollapseModule];

@NgModule({
  imports: [...MODULES, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...MODULES],
})
export class CardModule {}

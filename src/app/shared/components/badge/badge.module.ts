import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeDirective } from './badge.directive';
import { BadgeComponent } from './badge.component';

const DECLARATIONS = [BadgeDirective, BadgeComponent];
const MODULES = [CommonModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...MODULES],
})
export class BadgeModule {}

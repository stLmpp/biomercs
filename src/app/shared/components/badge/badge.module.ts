import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeDirective } from './badge.directive';
import { BadgeComponent } from './badge.component';

@NgModule({
  declarations: [BadgeDirective, BadgeComponent],
  imports: [CommonModule],
  exports: [BadgeDirective, BadgeComponent],
})
export class BadgeModule {}

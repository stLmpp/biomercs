import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseComponent } from './collapse.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { CollapseTitleDirective } from './collapse-title.directive';

@NgModule({
  declarations: [CollapseComponent, CollapseTitleDirective],
  exports: [CollapseComponent],
  imports: [CommonModule, ButtonModule, IconModule],
})
export class CollapseModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseComponent } from './collapse.component';
import { ButtonModule } from '../button/button.module';
import { IconModule } from '../icon/icon.module';
import { CollapseTitleDirective } from './collapse-title.directive';
import { CollapsedComponent } from './collapsed.component';

@NgModule({
  declarations: [CollapseComponent, CollapseTitleDirective, CollapsedComponent],
  exports: [CollapseComponent, CollapsedComponent],
  imports: [CommonModule, ButtonModule, IconModule],
})
export class CollapseModule {}

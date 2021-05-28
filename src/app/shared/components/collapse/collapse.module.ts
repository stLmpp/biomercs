import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollapseComponent } from './collapse.component';

@NgModule({
  declarations: [CollapseComponent],
  exports: [CollapseComponent],
  imports: [CommonModule],
})
export class CollapseModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaxPipe } from './max.pipe';
import { MinPipe } from './min.pipe';

@NgModule({
  declarations: [MaxPipe, MinPipe],
  exports: [MinPipe],
  imports: [CommonModule],
})
export class NumberModule {}

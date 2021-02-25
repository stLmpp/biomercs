import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDefinedPipe } from './is-defined.pipe';

@NgModule({
  declarations: [IsDefinedPipe],
  exports: [IsDefinedPipe],
  imports: [CommonModule],
})
export class UtilModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetPipe } from './get.pipe';

@NgModule({
  declarations: [GetPipe],
  exports: [GetPipe],
  imports: [CommonModule],
})
export class ObjectModule {}

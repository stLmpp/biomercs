import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncDefaultPipe } from './async-default.pipe';

@NgModule({
  declarations: [AsyncDefaultPipe],
  exports: [AsyncDefaultPipe],
  imports: [CommonModule],
})
export class AsyncDefaultModule {}

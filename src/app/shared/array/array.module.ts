import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';
import { JoinPipe } from './join.pipe';
import { AnyPipe } from './any.pipe';

const PIPES = [SearchPipe, JoinPipe, AnyPipe];

@NgModule({
  declarations: [...PIPES],
  imports: [CommonModule],
  exports: [...PIPES],
})
export class ArrayModule {}

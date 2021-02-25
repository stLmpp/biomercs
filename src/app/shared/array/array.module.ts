import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchPipe } from './search.pipe';
import { JoinPipe } from './join.pipe';

const PIPES = [SearchPipe];

@NgModule({
  declarations: [...PIPES, JoinPipe],
  imports: [CommonModule],
  exports: [...PIPES, JoinPipe],
})
export class ArrayModule {}

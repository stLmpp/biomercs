import { NgModule } from '@angular/core';
import { JoinPipe } from './join.pipe';
import { AnyPipe } from './any.pipe';

const PIPES = [JoinPipe, AnyPipe];

@NgModule({
  declarations: [...PIPES],
  exports: [...PIPES],
})
export class ArrayModule {}

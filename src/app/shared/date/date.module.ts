import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateDifferencePipe } from './date-difference.pipe';
import { DateEqualPipe } from './date-equal.pipe';

@NgModule({
  declarations: [DateDifferencePipe, DateEqualPipe],
  exports: [DateDifferencePipe, DateEqualPipe],
  imports: [CommonModule],
})
export class DateModule {}

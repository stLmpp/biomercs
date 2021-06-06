import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateDifferencePipe } from './date-difference.pipe';

@NgModule({
  declarations: [DateDifferencePipe],
  exports: [DateDifferencePipe],
  imports: [CommonModule],
})
export class DateModule {}

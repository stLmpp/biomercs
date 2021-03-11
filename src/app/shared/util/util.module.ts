import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IsDefinedPipe } from './is-defined.pipe';
import { YesNoPipe } from './yes-no.pipe';

@NgModule({
  declarations: [IsDefinedPipe, YesNoPipe],
  exports: [IsDefinedPipe, YesNoPipe],
  imports: [CommonModule],
})
export class UtilModule {}

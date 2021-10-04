import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillControlValueDirective } from './quill-control-value.directive';
import { QuillModule } from 'ngx-quill';
import 'quill-mention';

@NgModule({
  declarations: [QuillControlValueDirective],
  imports: [CommonModule, QuillModule],
  exports: [QuillControlValueDirective, QuillModule],
})
export class BioQuillModule {}

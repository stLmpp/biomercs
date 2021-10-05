import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { ViewerComponent } from './viewer.component';

@NgModule({
  declarations: [EditorComponent, ViewerComponent],
  exports: [EditorComponent, ViewerComponent],
  imports: [CommonModule],
})
export class EditorModule {}

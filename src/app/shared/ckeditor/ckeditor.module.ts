import { NgModule } from '@angular/core';
import { CKEditorModule as CKEditorModuleOrigin } from '@ckeditor/ckeditor5-angular';
import { CKEditorControlValue } from '@shared/ckeditor/ckeditor-control-value';
import { CKEditorView } from '@shared/ckeditor/ckeditor-view';

@NgModule({
  imports: [CKEditorModuleOrigin],
  declarations: [CKEditorControlValue, CKEditorView],
  exports: [CKEditorModuleOrigin, CKEditorControlValue, CKEditorView],
})
export class CKEditorModule {}

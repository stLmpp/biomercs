import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'ckeditor-view,[ckeditorView]',
  host: { '[innerHTML]': 'content', class: 'ckeditor-view ck-content' },
})
export class CKEditorView {
  @Input() content: string | null | undefined;
}

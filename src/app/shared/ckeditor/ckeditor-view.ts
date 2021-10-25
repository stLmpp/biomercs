import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'ckeditor-view,[ckeditorView]',
  template: `<div class="ck-content" [innerHTML]="content"></div>`,
  host: { class: 'ck ck-view' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CKEditorView {
  @Input() content: string | null | undefined;
}

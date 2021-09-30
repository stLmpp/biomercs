import { Directive, OnDestroy, OnInit, Self } from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { QuillEditorComponent } from 'ngx-quill';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: 'quill-editor[control],quill-editor[controlName],quill-editor[model]',
  providers: [{ provide: ControlValue, useExisting: QuillControlValueDirective, multi: true }],
})
export class QuillControlValueDirective extends ControlValue implements OnInit, OnDestroy {
  constructor(@Self() private quillEditorComponent: QuillEditorComponent) {
    super();
  }

  private readonly _destroy$ = new Subject<void>();

  setValue(value: any): void {
    this.quillEditorComponent.writeValue(value);
  }

  override setDisabled(disabled: boolean): void {
    this.quillEditorComponent.setDisabledState(disabled);
  }

  override focus(): void {
    this.quillEditorComponent.quillEditor.focus();
  }

  ngOnInit(): void {
    this.quillEditorComponent.onBlur.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.onTouched$.next();
    });
    this.quillEditorComponent.onContentChanged.pipe(takeUntil(this._destroy$)).subscribe($event => {
      this.onChange$.next($event.content);
    });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}

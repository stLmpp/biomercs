import { Directive, Host } from '@angular/core';
import { ControlValue } from '@stlmpp/control';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';

@Directive({
    selector: 'ckeditor[control],ckeditor[controlName],ckeditor[model]',
    providers: [{ provide: ControlValue, useExisting: CKEditorControlValue, multi: true }],
    standalone: false
})
export class CKEditorControlValue extends ControlValue<string | null | undefined> {
  constructor(@Host() private ckEditorComponent: CKEditorComponent) {
    super();
    this.ckEditorComponent.registerOnChange((value: string | null | undefined) => this.onChange$.next(value));
    this.ckEditorComponent.registerOnTouched(() => this.onTouched$.next());
  }

  setValue(value: string | null | undefined): void {
    this.ckEditorComponent.writeValue(value ?? null);
  }

  override setDisabled(disabled: boolean): void {
    this.ckEditorComponent.setDisabledState(disabled);
  }

  override focus(): void {
    this.ckEditorComponent.editorInstance?.editing.view.focus();
  }
}

import { AfterContentInit, Directive, KeyValueDiffers, OnInit, inject } from '@angular/core';
import { ControlError, ControlParent } from '@stlmpp/control';
import { FormFieldComponent } from './form-field.component';

@Directive({
  selector: 'bio-errors, [bioErrors]',
  host: { class: 'errors' },
  providers: [{ provide: ControlError, useExisting: FormFieldErrorsDirective }],
})
export class FormFieldErrorsDirective extends ControlError implements AfterContentInit, OnInit {
  private formFieldComponent = inject(FormFieldComponent, { host: true });
  private _controlParent: ControlParent;

  constructor() {
    const keyValueDiffers = inject(KeyValueDiffers);
    const _controlParent = inject(ControlParent, { optional: true, host: true });

    super(keyValueDiffers, _controlParent);

    this._controlParent = _controlParent;
  }

  override ngOnInit(): void {
    if (this.controlError) {
      super.ngOnInit();
    }
  }

  ngAfterContentInit(): void {
    if (this.formFieldComponent.control && !this.controlError) {
      this.controlError = this.formFieldComponent.control;
      super.ngOnInit();
    }
  }
}

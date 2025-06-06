import { AfterContentInit, Directive, Host, KeyValueDiffers, OnInit, Optional } from '@angular/core';
import { ControlError, ControlParent } from '@stlmpp/control';
import { FormFieldComponent } from './form-field.component';

@Directive({
  selector: 'bio-errors, [bioErrors]',
  host: { class: 'errors' },
  providers: [{ provide: ControlError, useExisting: FormFieldErrorsDirective }],
})
export class FormFieldErrorsDirective extends ControlError implements AfterContentInit, OnInit {
  constructor(
    @Host() private formFieldComponent: FormFieldComponent,
    keyValueDiffers: KeyValueDiffers,
    @Optional() @Host() private _controlParent?: ControlParent
  ) {
    super(keyValueDiffers, _controlParent);
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

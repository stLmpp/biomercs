import { AfterContentInit, Directive, forwardRef, Host, KeyValueDiffers, OnInit, Optional } from '@angular/core';
import { ControlError, ControlParent } from '@stlmpp/control';
import { FormFieldComponent } from './form-field.component';

@Directive({
  selector: 'errors',
  host: { class: 'errors' },
  providers: [{ provide: ControlError, useExisting: forwardRef(() => FormFieldErrorsDirective) }],
})
export class FormFieldErrorsDirective extends ControlError implements AfterContentInit, OnInit {
  constructor(
    @Host() private formFieldComponent: FormFieldComponent,
    keyValueDiffers: KeyValueDiffers,
    @Optional() @Host() private _controlParent?: ControlParent
  ) {
    super(keyValueDiffers, _controlParent);
  }

  ngOnInit(): void {
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

import { Directive, ElementRef, HostBinding, Input, Optional, Self } from '@angular/core';
import { AbstractComponent } from '../core/abstract-component';
import { Control, ControlDirective, ModelDirective } from '@stlmpp/control';
import { FocusableOption } from '@angular/cdk/a11y';
import { FormFieldChild } from '@shared/components/form/form-field-child';

@Directive({
  selector: 'input[bioInput]:not([type=checkbox]):not([type=radio]),textarea[bioInput]',
  host: { class: 'input' },
  exportAs: 'bio-input',
  providers: [{ provide: FormFieldChild, useExisting: InputDirective }],
})
export class InputDirective extends AbstractComponent implements FocusableOption {
  constructor(
    public elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>,
    @Optional() @Self() public controlDirective?: ControlDirective,
    @Optional() @Self() public modelDirective?: ModelDirective
  ) {
    super();
  }

  @Input() @HostBinding('attr.id') id?: number | string;

  override get primaryClass(): boolean {
    return !this.dangerClass && (this.bioType || 'primary') === 'primary';
  }

  override get dangerClass(): boolean {
    return this.bioType === 'danger' || !!(this.control?.touched && this.control.invalid);
  }

  get control(): Control | undefined {
    return this.controlDirective?.control ?? this.modelDirective?.control;
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}

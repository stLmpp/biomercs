import { Directive, ElementRef, HostBinding, inject, input } from '@angular/core';
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
  elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);
  controlDirective? = inject(ControlDirective, { optional: true, self: true });
  modelDirective? = inject(ModelDirective, { optional: true, self: true });


  @HostBinding('attr.id')
readonly id = input<number | string>();

  override get primaryClass(): boolean {
    return !this.dangerClass && (this.bioType() || 'primary') === 'primary';
  }

  override get dangerClass(): boolean {
    return this.bioType() === 'danger' || !!(this.control?.touched && this.control.invalid);
  }

  get control(): Control | undefined {
    return this.controlDirective?.control ?? this.modelDirective?.control;
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }
}

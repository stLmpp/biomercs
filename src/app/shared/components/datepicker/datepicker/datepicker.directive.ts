import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DatepickerComponent } from '@shared/components/datepicker/datepicker/datepicker.component';
import { ControlValue } from '@stlmpp/control';
import { format } from 'date-fns';
import { AuthQuery } from '../../../../auth/auth.query';

@Directive({
  selector: 'input[bioDatepicker]',
  providers: [{ provide: ControlValue, useExisting: DatepickerDirective, multi: false }],
})
export class DatepickerDirective extends ControlValue<Date | null | undefined> implements OnInit {
  constructor(
    public elementRef: ElementRef<HTMLInputElement>,
    private renderer2: Renderer2,
    private authQuery: AuthQuery
  ) {
    super();
  }

  @Input() bioDatepicker!: DatepickerComponent;

  @HostListener('blur')
  onBlur(): void {
    this.onTouched$.next();
  }

  setValue(value: Date | null | undefined): void {
    this.bioDatepicker.value = value;
    const mask = this.authQuery.getUser()?.dateFormat ?? 'dd/MM/yyyy';
    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', value && format(value, mask));
  }

  setDisabled(disabled: boolean): void {
    this.renderer2.setProperty(this.elementRef.nativeElement, 'disabled', disabled);
    this.bioDatepicker.disabled = disabled;
  }

  ngOnInit(): void {
    this.bioDatepicker.setInput(this);
  }
}

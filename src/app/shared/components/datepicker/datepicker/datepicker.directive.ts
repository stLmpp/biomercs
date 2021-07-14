import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { DatepickerComponent } from '@shared/components/datepicker/datepicker/datepicker.component';
import { ControlValue } from '@stlmpp/control';
import { parse } from 'date-fns';
import { AuthQuery } from '../../../../auth/auth.query';
import { InputmaskService } from '@shared/inputmask/inputmask.service';

@Directive({
  selector: 'input[bioDatepicker]',
  providers: [{ provide: ControlValue, useExisting: DatepickerDirective, multi: false }],
})
export class DatepickerDirective extends ControlValue<Date | null | undefined> implements OnInit {
  constructor(
    public elementRef: ElementRef<HTMLInputElement>,
    private renderer2: Renderer2,
    private authQuery: AuthQuery,
    private inputmaskService: InputmaskService
  ) {
    super();
  }

  private readonly _mask = this.inputmaskService.createMask('datetime', {
    inputFormat: this._getDateFormat().toLowerCase(),
    placeholder: this._getDateFormat().toUpperCase(),
    oncomplete: () => {
      const date = parse(this.elementRef.nativeElement.value, this._getDateFormat(), new Date());
      this.onChange$.next(date);
      this.bioDatepicker.value = date;
    },
  });

  @Input() bioDatepicker!: DatepickerComponent;

  private _getDateFormat(): string {
    return this.authQuery.getUser()?.dateFormat ?? 'dd/MM/yyyy';
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched$.next();
  }

  setValue(value: Date | null | undefined): void {
    this.bioDatepicker.value = value;
    this.renderer2.setProperty(this.elementRef.nativeElement, 'value', value);
  }

  override setDisabled(disabled: boolean): void {
    this.bioDatepicker.disabled = disabled;
    this.renderer2.setProperty(this.elementRef.nativeElement, 'disabled', disabled);
  }

  ngOnInit(): void {
    this.bioDatepicker.setInput(this);
    this._mask.mask(this.elementRef.nativeElement);
  }
}

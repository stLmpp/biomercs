import { Directive, ElementRef, HostBinding, HostListener, Input, inject, input, output } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { Autocomplete } from '@shared/components/autocomplete/autocomplete';

@Directive({
  selector: 'bio-autocomplete-option',
  host: { class: 'autocomplete-option' },
})
export class AutocompleteOptionDirective implements FocusableOption {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private autocomplete = inject(Autocomplete, { host: true });

  private _disabled = false;

  readonly value = input.required<string>();

  @HostBinding('class.disabled')
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  readonly autocompleteSelect = output<string>();

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this._disabled ? -1 : 0;
  }

  @HostBinding('class.selected')
  get selectedClass(): boolean {
    return this.autocomplete.isSelected(this.value());
  }

  @HostListener('click')
  @HostListener('keydown.enter')
  onSelect(): void {
    if (!this._disabled) {
      const value = this.value();
      this.autocomplete.select(value);
      this.autocompleteSelect.emit(value);
    }
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

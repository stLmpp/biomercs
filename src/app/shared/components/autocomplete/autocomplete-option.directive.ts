import { Directive, ElementRef, EventEmitter, Host, HostBinding, HostListener, Input, Output } from '@angular/core';
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { Autocomplete } from '@shared/components/autocomplete/autocomplete';

@Directive({
    selector: 'bio-autocomplete-option',
    host: { class: 'autocomplete-option' },
    standalone: false
})
export class AutocompleteOptionDirective implements FocusableOption {
  constructor(private elementRef: ElementRef<HTMLElement>, @Host() private autocomplete: Autocomplete) {}

  private _disabled = false;

  @Input() value!: string;

  @HostBinding('class.disabled')
  @Input()
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Output() readonly autocompleteSelect = new EventEmitter<string>();

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this._disabled ? -1 : 0;
  }

  @HostBinding('class.selected')
  get selectedClass(): boolean {
    return this.autocomplete.isSelected(this.value);
  }

  @HostListener('click')
  @HostListener('keydown.enter')
  onSelect(): void {
    if (!this._disabled) {
      this.autocomplete.select(this.value);
      this.autocompleteSelect.emit(this.value);
    }
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

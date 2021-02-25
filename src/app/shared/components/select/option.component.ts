import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from './select';
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { OptgroupComponent } from './optgroup.component';

@Component({
  selector: 'bio-option',
  template: '<ng-content></ng-content>',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bio-option' },
  encapsulation: ViewEncapsulation.None,
})
export class OptionComponent implements FocusableOption {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Host() private select: Select,
    @Host() @Optional() public optgroupComponent?: OptgroupComponent
  ) {}

  private _disabled = false;

  @Input() value: any;
  @Input() labelTypeahead?: string;
  @Input() labelFn: (optionComponent: OptionComponent) => string = optionComponent =>
    this.optgroupComponent
      ? `<span>${this.optgroupComponent.label}</span> ${this.elementRef.nativeElement.innerHTML}`
      : optionComponent.elementRef.nativeElement.innerHTML;

  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
  }

  @HostBinding('class.selected')
  get selectedClass(): boolean {
    return this.select.isSelected(this.value);
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this._disabled ? -1 : 0;
  }

  @HostListener('click')
  onClick(): void {
    if (this._disabled) {
      return;
    }
    this.select.setControlValue(this.value);
    this.select.setViewValue(this.getViewValue());
  }

  @HostListener('keydown.enter')
  onKeydownEnter(): void {
    this.select.setControlValue(this.value);
    this.select.setViewValue(this.getViewValue());
  }

  getViewValue(): string {
    return this.labelFn(this);
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return this.labelTypeahead ?? this.elementRef.nativeElement.innerText;
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

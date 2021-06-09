import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Host,
  HostBinding,
  HostListener,
  Input,
  Optional,
  SecurityContext,
  ViewEncapsulation,
} from '@angular/core';
import { Select } from './select';
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { OptgroupComponent } from './optgroup.component';
import { Option } from '@shared/components/select/option';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'bio-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bio-option' },
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Option, useExisting: OptionComponent }],
})
export class OptionComponent extends Option implements FocusableOption {
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Host() private select: Select,
    public changeDetectorRef: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    @Host() @Optional() public optgroupComponent?: OptgroupComponent
  ) {
    super();
    this.multiple = select.multiple;
  }

  private _disabled = false;

  @HostBinding('class.multiple') multiple: boolean;

  @Input() value: any;
  @Input() labelTypeahead?: string;

  isSelected = false;

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
    return this.select.isSelected(this);
  }

  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this._disabled ? -1 : 0;
  }

  private _setValueSelect(): void {
    this.select.setControlValue(this.value);
    if (!this.multiple) {
      this.select.setViewValue(this.getViewValue());
    } else {
      this.isSelected = !this.isSelected;
      this.optgroupComponent?.changeDetectorRef.markForCheck();
    }
  }

  @Input() labelFn: (optionComponent: OptionComponent) => string | SafeHtml = optionComponent =>
    this.domSanitizer.sanitize(
      SecurityContext.HTML,
      this.optgroupComponent
        ? `${this.optgroupComponent.label} ${this.elementRef.nativeElement.innerHTML}`
        : optionComponent.elementRef.nativeElement.innerHTML
    ) ?? '';

  @HostListener('click', ['$event'])
  onClick($event: MouseEvent): void {
    if (this._disabled) {
      return;
    }
    if (this.optgroupComponent) {
      $event.stopPropagation();
    }
    this._setValueSelect();
  }

  @HostListener('keydown.enter')
  onKeydownEnter(): void {
    this._setValueSelect();
  }

  onCheckedChange(): void {
    if (this._disabled) {
      return;
    }
    this._setValueSelect();
  }

  getViewValue(): string | SafeHtml {
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

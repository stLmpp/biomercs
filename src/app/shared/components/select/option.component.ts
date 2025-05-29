import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  SecurityContext,
  ViewEncapsulation,
  inject,
  input,
} from '@angular/core';
import { Select } from './select';
import { FocusableOption } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { OptgroupComponent } from './optgroup.component';
import { Option } from '@shared/components/select/option';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'bio-option',
  templateUrl: './option.component.html',
  styleUrls: ['./option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'bio-option' },
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: Option, useExisting: OptionComponent }],
  imports: [CheckboxComponent, NgTemplateOutlet],
})
export class OptionComponent extends Option implements FocusableOption {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private select = inject(Select, { host: true });
  changeDetectorRef = inject(ChangeDetectorRef);
  private domSanitizer = inject(DomSanitizer);
  optgroupComponent? = inject(OptgroupComponent, { host: true, optional: true });

  constructor() {
    super();
    const select = this.select;

    this.multiple = select.multiple;
  }

  private _disabled = false;

  @HostBinding('class.multiple') multiple: boolean;

  readonly value = input<any>();
  readonly labelTypeahead = input<string>();

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
    this.select.setControlValue(this.value());
    if (!this.multiple) {
      this.select.setViewValue(this.getViewValue());
    } else {
      this.isSelected = !this.isSelected;
      this.optgroupComponent?.changeDetectorRef.markForCheck();
    }
  }

  readonly labelFn = input<(optionComponent: OptionComponent) => string | SafeHtml>(
    optionComponent =>
      this.domSanitizer.sanitize(
        SecurityContext.HTML,
        this.optgroupComponent
          ? `${this.optgroupComponent.label} ${this.elementRef.nativeElement.innerHTML}`
          : optionComponent.elementRef.nativeElement.innerHTML
      ) ?? ''
  );

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
    return this.labelFn()(this);
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel(): string {
    return this.labelTypeahead() ?? this.elementRef.nativeElement.innerText;
  }

  static ngAcceptInputType_disabled: BooleanInput;
}

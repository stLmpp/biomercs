import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewEncapsulation } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from 'st-utils';
import { AbstractComponent } from '../core/abstract-component';
import { FocusableOption } from '@angular/cdk/a11y';

@Component({
  selector: 'button[bioButton],a[bioButton]',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'button' },
})
export class ButtonComponent extends AbstractComponent implements FocusableOption {
  constructor(private elementRef: ElementRef<HTMLButtonElement>) {
    super();
  }

  private _loading = false;
  private _tabindex = 0;
  private _block = false;

  override get disabledClass(): boolean | null {
    return this._loading || this._disabled || null;
  }

  @Input()
  @HostBinding('attr.tabindex')
  get tabindex(): number {
    return this.disabledClass ? -1 : this._tabindex || 0;
  }
  set tabindex(tabindex: number) {
    this._tabindex = tabindex ? +tabindex : 0;
  }

  @HostBinding('attr.disabled')
  get disabledAttr(): boolean | null {
    return this.disabledClass;
  }

  @Input()
  @HostBinding('class.loading')
  get loading(): boolean {
    return this._loading;
  }
  set loading(loading: boolean) {
    this._loading = coerceBooleanProperty(loading);
  }

  @Input() icon: BooleanInput;

  @HostBinding('class.button-icon')
  get isIcon(): boolean {
    return coerceBooleanProperty(this.icon);
  }

  @Input() fab: BooleanInput;

  @HostBinding('class.fab')
  get isFab(): boolean {
    return coerceBooleanProperty(this.fab);
  }

  @Input()
  @HostBinding('class.block')
  get block(): boolean {
    return this._block;
  }
  set block(block: boolean) {
    this._block = coerceBooleanProperty(block);
  }

  get nativeElement(): HTMLButtonElement {
    return this.elementRef.nativeElement;
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  static ngAcceptInputType_loading: BooleanInput;
  static ngAcceptInputType_block: BooleanInput;
}

import {
  ComponentRef,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { Nullable } from '../../type/nullable';
import { BooleanInput, coerceBooleanProperty, NumberInput } from '@angular/cdk/coercion';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { overlayPositionsArray } from '@util/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';
import { TOOLTIP_DEFAULT_CONFIG, TooltipConfig } from './tooltip-token';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[tooltip]',
  exportAs: 'tooltip',
})
export class TooltipDirective implements OnDestroy {
  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef<HTMLElement>,
    private viewContainerRef: ViewContainerRef,
    @Inject(TOOLTIP_DEFAULT_CONFIG) private tooltipDefaultConfig: TooltipConfig
  ) {}

  private _disabled = false;
  private _overlayRef?: OverlayRef;
  private _componentRef?: ComponentRef<TooltipComponent>;
  private _showTimeout: any;
  private _hideTimeout: any;
  private _hasShown = false;

  @HostBinding('attr.aria-tooltip')
  @Input()
  tooltip!: Nullable<string | number>;

  @Input() tooltipPositions: ConnectedPosition[] = overlayPositionsArray('top');
  @Input() tooltipShowDelay = 0;
  @Input() tooltipHideDelay = 0;
  @Input() tooltipDelay = 0;
  @Input() tooltipScrollStrategy = this.overlay.scrollStrategies.reposition({ autoClose: true, scrollThrottle: 5 });
  @Input() tooltipAriaLabelDisabled = false;

  @HostBinding('attr.aria-label')
  get ariaLabel(): number | string | null | undefined {
    return this.tooltipAriaLabelDisabled ? null : this.tooltip;
  }

  @Input()
  set tooltipPosition(position: TooltipPosition | undefined) {
    this.tooltipPositions = overlayPositionsArray(position);
  }

  @Input()
  get tooltipDisabled(): boolean {
    return this._disabled;
  }
  set tooltipDisabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
    if (this._disabled && this.isOpen) {
      this._overlayRef?.dispose();
    }
  }

  isOpen = false;

  private _getShowDelay(): number {
    return (
      this.tooltipShowDelay ||
      this.tooltipDelay ||
      this.tooltipDefaultConfig.showDelay ||
      this.tooltipDefaultConfig.delay
    );
  }

  private _getHideDelay(): number {
    return (
      this.tooltipHideDelay ||
      this.tooltipDelay ||
      this.tooltipDefaultConfig.hideDelay ||
      this.tooltipDefaultConfig.delay
    );
  }

  @HostListener('mousedown')
  onMousedown(): void {
    this.hide(0);
  }

  @HostListener('mouseenter')
  onMouseenter(): void {
    this.show();
  }

  @HostListener('mouseleave')
  onMouseleave(): void {
    this.hide();
  }

  show(delay?: number): void {
    clearTimeout(this._hideTimeout);
    this._hideTimeout = null;
    if (this.isOpen || this._disabled) {
      return;
    }
    delay ??= this._getShowDelay();
    this._hasShown = true;
    this._showTimeout = setTimeout(() => {
      this._overlayRef?.dispose();
      this._overlayRef = this.overlay.create({
        hasBackdrop: false,
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.elementRef.nativeElement)
          .withPositions(this.tooltipPositions),
        scrollStrategy: this.tooltipScrollStrategy,
      });
      this._componentRef = this._overlayRef.attach(new ComponentPortal(TooltipComponent, this.viewContainerRef));
      this._componentRef.instance.content = this.tooltip;
      this._componentRef.changeDetectorRef.markForCheck();
      this.isOpen = true;
    }, delay);
  }

  hide(delay?: number): void {
    clearTimeout(this._showTimeout);
    this._showTimeout = null;
    if (!this.isOpen || this._disabled) {
      return;
    }
    delay ??= this._getHideDelay();
    this._hideTimeout = setTimeout(() => {
      this._overlayRef?.detach();
      this.isOpen = false;
      this._componentRef?.instance.onAnimationEnd$.subscribe(() => {
        this._overlayRef?.dispose();
      });
    }, delay);
  }

  toggle(delay?: number): void {
    if (this.isOpen) {
      this.hide(delay);
    } else {
      this.show(delay);
    }
  }

  ngOnDestroy(): void {
    if (this._showTimeout) {
      clearTimeout(this._showTimeout);
    }
    if (this._hideTimeout) {
      clearTimeout(this._hideTimeout);
    }
    this._overlayRef?.dispose();
  }

  static ngAcceptInputType_tooltipDisabled: BooleanInput;
  static ngAcceptInputType_tooltipShowDelay: NumberInput;
  static ngAcceptInputType_tooltipHideDelay: NumberInput;
}

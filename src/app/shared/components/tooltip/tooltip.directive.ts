import { ComponentRef, Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, ViewContainerRef, inject, input } from '@angular/core';
import { BooleanInput, coerceBooleanProperty, coerceNumberProperty, NumberInput } from 'st-utils';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { overlayPositionsArray } from '@util/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TooltipComponent } from './tooltip.component';
import { TOOLTIP_DEFAULT_CONFIG, TooltipConfig } from './tooltip-token';

export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Directive({
  selector: '[bioTooltip]',
  exportAs: 'tooltip',
})
export class TooltipDirective implements OnDestroy {
  private overlay = inject(Overlay);
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private tooltipDefaultConfig = inject<TooltipConfig>(TOOLTIP_DEFAULT_CONFIG);


  private _disabled = false;
  private _overlayRef?: OverlayRef;
  private _componentRef?: ComponentRef<TooltipComponent>;
  private _showTimeout: any;
  private _hideTimeout: any;
  private _hasShown = false;

  readonly bioTooltip = input.required<string | number | null | undefined>();
  readonly bioTooltipPositions = input<ConnectedPosition[]>(overlayPositionsArray('top'));
  readonly bioTooltipShowDelay = input(0);
  readonly bioTooltipHideDelay = input(0);
  readonly bioTooltipDelay = input(0);
  readonly bioTooltipScrollStrategy = input(this.overlay.scrollStrategies.reposition({ autoClose: true, scrollThrottle: 5 }));
  readonly bioTooltipAriaLabelDisabled = input(false);

  @HostBinding('attr.aria-label')
  get ariaLabel(): number | string | null | undefined {
    return this.bioTooltipAriaLabelDisabled() ? null : this.bioTooltip();
  }

  @Input()
  set bioTooltipPosition(position: TooltipPosition | undefined) {
    this.bioTooltipPositions = overlayPositionsArray(position);
  }

  @Input()
  get bioTooltipDisabled(): boolean {
    return this._disabled;
  }
  set bioTooltipDisabled(disabled: boolean) {
    this._disabled = coerceBooleanProperty(disabled);
    if (this._disabled && this.isOpen) {
      this._overlayRef?.dispose();
    }
  }

  isOpen = false;

  private _getShowDelay(): number {
    return coerceNumberProperty(
      this.bioTooltipShowDelay() ||
        this.bioTooltipDelay() ||
        this.tooltipDefaultConfig.showDelay ||
        this.tooltipDefaultConfig.delay
    );
  }

  private _getHideDelay(): number {
    return coerceNumberProperty(
      this.bioTooltipHideDelay() ||
        this.bioTooltipDelay() ||
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
          .withPositions(this.bioTooltipPositions()),
        scrollStrategy: this.bioTooltipScrollStrategy(),
      });
      this._componentRef = this._overlayRef.attach(new ComponentPortal(TooltipComponent, this.viewContainerRef));
      this._componentRef.instance.content = this.bioTooltip();
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

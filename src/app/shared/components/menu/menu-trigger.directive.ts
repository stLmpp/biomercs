import { Directive, ElementRef, HostListener, Inject, Input, ViewContainerRef, DOCUMENT } from '@angular/core';
import { MenuComponent } from './menu.component';
import { Overlay } from '@angular/cdk/overlay';
import { cdkOverlayTransparentBackdrop } from '@util/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Destroyable } from '../common/destroyable-component';
import { takeUntil } from 'rxjs';

import { getOverlayPositionMenu } from '@shared/components/menu/util';

@Directive({
    selector: '[bioMenuTrigger]',
    standalone: false
})
export class MenuTriggerDirective extends Destroyable {
  constructor(
    private overlay: Overlay,
    private elementRef: ElementRef,
    private viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  private _lastFocusedElement?: Element | null;

  @Input() bioMenuTrigger!: MenuComponent;
  @Input() bioMenuTriggerOn: 'hover' | 'click' = 'click';

  opened = false;

  private _isClick(): boolean {
    return this.bioMenuTriggerOn === 'click';
  }

  private _createOverlay(): void {
    if (this.opened) {
      return;
    }
    const overlayRef = this.overlay.create({
      scrollStrategy: this._isClick()
        ? this.overlay.scrollStrategies.block()
        : this.overlay.scrollStrategies.close({ threshold: 5 }),
      positionStrategy: getOverlayPositionMenu(this.overlay, this.elementRef),
      hasBackdrop: this._isClick(),
      backdropClass: cdkOverlayTransparentBackdrop,
    });
    overlayRef
      .detachments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.opened = false;
        if (this._lastFocusedElement) {
          (this._lastFocusedElement as HTMLElement).focus();
        }
      });
    overlayRef
      .backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.opened = false;
        overlayRef?.detach();
      });
    this.bioMenuTrigger.overlayRef = overlayRef;
    this.bioMenuTrigger.trigger = this.bioMenuTriggerOn;
    const templatePortal = new TemplatePortal(this.bioMenuTrigger.templateRef, this.viewContainerRef);
    overlayRef.attach(templatePortal);
    this.bioMenuTrigger.initFocus();
    this.opened = true;
  }

  @HostListener('mouseenter')
  onMouseenter(): void {
    if (this._isClick()) {
      this._lastFocusedElement = this.document.activeElement;
      return;
    }
    this._createOverlay();
  }

  @HostListener('click')
  onClick(): void {
    if (!this._isClick()) {
      return;
    }
    this._createOverlay();
  }
}

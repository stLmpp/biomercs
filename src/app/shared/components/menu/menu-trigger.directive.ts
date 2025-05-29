import { Directive, ElementRef, HostListener, ViewContainerRef, DOCUMENT, inject, input } from '@angular/core';
import { MenuComponent } from './menu.component';
import { Overlay } from '@angular/cdk/overlay';
import { cdkOverlayTransparentBackdrop } from '@util/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Destroyable } from '../common/destroyable-component';
import { takeUntil } from 'rxjs';

import { getOverlayPositionMenu } from '@shared/components/menu/util';

@Directive({ selector: '[bioMenuTrigger]' })
export class MenuTriggerDirective extends Destroyable {
  private overlay = inject(Overlay);
  private elementRef = inject(ElementRef);
  private viewContainerRef = inject(ViewContainerRef);
  private document = inject<Document>(DOCUMENT);

  private _lastFocusedElement?: Element | null;

  readonly bioMenuTrigger = input.required<MenuComponent>();
  readonly bioMenuTriggerOn = input<'hover' | 'click'>('click');

  opened = false;

  private _isClick(): boolean {
    return this.bioMenuTriggerOn() === 'click';
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
    bioMenuTrigger.overlayRef = overlayRef;
    bioMenuTrigger.trigger = this.bioMenuTriggerOn();
    const templatePortal = new TemplatePortal(bioMenuTrigger.templateRef, this.viewContainerRef);
    overlayRef.attach(templatePortal);
    bioMenuTrigger.initFocus();
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

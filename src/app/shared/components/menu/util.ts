import { Overlay, PositionStrategy } from '@angular/cdk/overlay';
import { ElementRef } from '@angular/core';
import { overlayPositions } from '@util/overlay';

export function getOverlayPositionMenu(overlay: Overlay, elementRef: ElementRef): PositionStrategy {
  return overlay
    .position()
    .flexibleConnectedTo(elementRef.nativeElement)
    .withPositions([
      { ...overlayPositions().bottom, offsetY: 2, overlayX: 'start', originX: 'start' },
      { ...overlayPositions().bottom, offsetY: 2, overlayX: 'end', originX: 'end' },
      { ...overlayPositions().top, offsetY: -2, overlayX: 'start', originX: 'start' },
      { ...overlayPositions().top, offsetY: -2, overlayX: 'end', originX: 'end' },
    ]);
}

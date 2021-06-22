import { ConnectedPosition } from '@angular/cdk/overlay';

export function getDatepickerOverlayPositions(): ConnectedPosition[] {
  return [
    {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetY: 5,
    },
    {
      originX: 'start',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetY: -5,
    },
  ];
}

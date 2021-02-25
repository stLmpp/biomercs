import { ConnectedPosition } from '@angular/cdk/overlay';
import { rotateArray } from './util';

export interface OverlayPositions {
  top: ConnectedPosition;
  right: ConnectedPosition;
  bottom: ConnectedPosition;
  left: ConnectedPosition;
}

export const overlayPositions = (): OverlayPositions => ({
  top: {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom',
  },
  right: {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
  },
  bottom: {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  left: {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
  },
});

export const overlayPositionsArray = (from: keyof OverlayPositions = 'top'): ConnectedPosition[] => {
  const { top, right, left, bottom } = overlayPositions();
  const array = [top, right, bottom, left];
  let rotations = 0;
  switch (from) {
    case 'right':
      rotations = 1;
      break;
    case 'bottom':
      rotations = 2;
      break;
    case 'left':
      rotations = 3;
      break;
  }
  return rotations ? rotateArray([top, right, bottom, left], rotations) : array;
};

export const cdkOverlayTransparentBackdrop = 'cdk-overlay-transparent-backdrop';

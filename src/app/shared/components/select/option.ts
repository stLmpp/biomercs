import { ChangeDetectorRef } from '@angular/core';

export abstract class Option {
  abstract value: any;
  abstract isSelected: boolean;
  abstract changeDetectorRef: ChangeDetectorRef;
  abstract disabled: boolean;
}

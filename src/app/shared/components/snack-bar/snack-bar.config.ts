import { InjectionToken, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { v4 } from 'uuid';

export const SNACK_BAR_DEFAULT_CONFIG = new InjectionToken<SnackBarConfig>('SNACK_BAR_DEFAULT_CONFIG');

export class SnackBarConfig {
  constructor(partial?: Partial<SnackBarConfig>) {
    Object.assign(this, partial);
  }

  id = v4();
  panelClass?: string | string[];
  message?: string;
  action: string | null | undefined = 'Close';
  showAction = true;

  actionObservable?: Observable<any>;
  viewContainerRef?: ViewContainerRef;
  timeout: number | null | undefined = 5000;
  timeoutCloseWithObservable = false;
}

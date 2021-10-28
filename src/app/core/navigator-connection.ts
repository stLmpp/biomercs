import { Inject, Injectable } from '@angular/core';
import { NAVIGATOR } from './navigator.token';

@Injectable({ providedIn: 'root' })
export class NavigatorConnection {
  constructor(@Inject(NAVIGATOR) navigator: Navigator) {
    const connection = (navigator as Navigator & { connection: NavigatorConnection | undefined }).connection;
    this.effectiveType = connection?.effectiveType;
    this.saveData = connection?.saveData;
  }

  effectiveType?: string;
  saveData?: boolean;
}

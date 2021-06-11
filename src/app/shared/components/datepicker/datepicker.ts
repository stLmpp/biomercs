import { trackByFactory } from '@stlmpp/utils';
import { InjectionToken } from '@angular/core';

export class DatepickerDay {
  constructor(public day: number, public weekend: boolean, public disabled = false) {}

  static trackBy = trackByFactory<DatepickerDay>();
}

export const DATEPICKER_LOCALE = new InjectionToken<string>('Datepicker Locale');

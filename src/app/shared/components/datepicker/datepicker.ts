import { trackByFactory } from '@stlmpp/utils';
import { InjectionToken } from '@angular/core';

export class DatepickerDay {
  constructor(public date: Date, public weekend: boolean, public disabled = false) {
    this.day = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  day: number;
  month: number;
  year: number;

  static trackBy = trackByFactory<DatepickerDay>();
}

export const DATEPICKER_LOCALE = new InjectionToken<string>('Datepicker Locale');

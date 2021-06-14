import { trackByFactory } from '@stlmpp/utils';
import { InjectionToken } from '@angular/core';
import { setMonth, setYear } from 'date-fns';

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

export class DatepickerMonth {
  constructor(public month: number, public name: string) {}

  date = setMonth(new Date(), this.month);

  static trackBy = trackByFactory<DatepickerMonth>();
}

export class DatepickerYear {
  constructor(public year: number) {}

  date = setYear(new Date(), this.year);

  static trackBy = trackByFactory<DatepickerYear>();
}

export const DATEPICKER_LOCALE = new InjectionToken<string>('Datepicker Locale');

import { trackByFactory } from '@stlmpp/utils';

export class CalendarDay {
  constructor(
    public date: Date,
    public weekend: boolean,
    public disabled = false
  ) {
    this.day = date.getDate();
    this.month = date.getMonth();
    this.year = date.getFullYear();
  }

  day: number;
  month: number;
  year: number;

  static trackBy = trackByFactory<CalendarDay>();
}

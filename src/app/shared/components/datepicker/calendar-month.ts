import { trackByFactory } from '@stlmpp/utils';

export class CalendarMonth {
  constructor(
    public month: number,
    public name: string
  ) {}

  static trackBy = trackByFactory<CalendarMonth>();
}

import { Directive } from '@angular/core';

@Directive({
  selector: '[bioCalendarFooter],bio-calendar-footer',
  host: { class: 'bio-calendar-footer-directive' },
})
export class CalendarFooterDirective {}

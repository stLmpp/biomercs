import { Directive, Host, HostListener } from '@angular/core';
import { CalendarComponent } from '@shared/components/datepicker/calendar/calendar.component';

@Directive({
    selector: '[bioCalendarFooterClear]',
    standalone: false
})
export class CalendarFooterClearDirective {
  constructor(@Host() private readonly calendarComponent: CalendarComponent) {}

  @HostListener('click')
  onClick(): void {
    if (this.calendarComponent.disabled) {
      return;
    }
    this.calendarComponent.onDaySelect(null);
  }
}

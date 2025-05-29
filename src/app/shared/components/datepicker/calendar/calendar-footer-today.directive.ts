import { Directive, Host, HostListener } from '@angular/core';
import { CalendarComponent } from '@shared/components/datepicker/calendar/calendar.component';

@Directive({
    selector: '[bioCalendarFooterToday]',
    standalone: false
})
export class CalendarFooterTodayDirective {
  constructor(@Host() private readonly calendarComponent: CalendarComponent) {}

  @HostListener('click')
  onClick(): void {
    if (this.calendarComponent.disabled) {
      return;
    }
    this.calendarComponent.onDaySelect(new Date());
  }
}

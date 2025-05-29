import { Directive, HostListener, inject } from '@angular/core';
import { CalendarComponent } from '@shared/components/datepicker/calendar/calendar.component';

@Directive({ selector: '[bioCalendarFooterToday]' })
export class CalendarFooterTodayDirective {
  private readonly calendarComponent = inject(CalendarComponent, { host: true });

  @HostListener('click')
  onClick(): void {
    if (this.calendarComponent.disabled) {
      return;
    }
    this.calendarComponent.onDaySelect(new Date());
  }
}

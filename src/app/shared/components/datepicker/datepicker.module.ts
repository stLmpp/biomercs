import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDaysComponent } from './calendar-days/calendar-days.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { DateModule } from '@shared/date/date.module';
import { CalendarAdapter } from '@shared/components/datepicker/calendar-adapter';
import { CalendarMonthsComponent } from './calendar-months/calendar-months.component';
import { CalendarYearsComponent } from './calendar-years/calendar-years.component';
import { CALENDAR_LOCALE } from '@shared/components/datepicker/calendar-locale.token';

@NgModule({
  declarations: [CalendarComponent, CalendarDaysComponent, CalendarMonthsComponent, CalendarYearsComponent],
  exports: [CalendarComponent, ButtonModule],
  imports: [ButtonModule, DateModule],
})
export class DatepickerModule {
  static forRoot(): ModuleWithProviders<DatepickerModule> {
    return {
      ngModule: DatepickerModule,
      providers: [{ provide: CALENDAR_LOCALE, useExisting: LOCALE_ID }, CalendarAdapter],
    };
  }
}

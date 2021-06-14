import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDaysComponent } from './calendar-days/calendar-days.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { DATEPICKER_LOCALE } from '@shared/components/datepicker/datepicker';
import { DateModule } from '@shared/date/date.module';
import { CalendarAdapter } from '@shared/components/datepicker/calendar-adapter';
import { StUtilsArrayModule } from '@stlmpp/utils';
import { CalendarMonthsComponent } from './calendar-months/calendar-months.component';
import { CalendarYearsComponent } from './calendar-years/calendar-years.component';

@NgModule({
  declarations: [CalendarComponent, CalendarDaysComponent, CalendarMonthsComponent, CalendarYearsComponent],
  exports: [CalendarComponent, ButtonModule],
  imports: [ButtonModule, DateModule, StUtilsArrayModule],
})
export class DatepickerModule {
  static forRoot(): ModuleWithProviders<DatepickerModule> {
    return {
      ngModule: DatepickerModule,
      providers: [{ provide: DATEPICKER_LOCALE, useExisting: LOCALE_ID }, CalendarAdapter],
    };
  }
}

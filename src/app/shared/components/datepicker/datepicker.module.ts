import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDaysComponent } from './calendar-days/calendar-days.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { DATEPICKER_LOCALE } from '@shared/components/datepicker/datepicker';

@NgModule({
  declarations: [CalendarComponent, CalendarDaysComponent],
  exports: [CalendarComponent, ButtonModule],
  imports: [ButtonModule],
})
export class DatepickerModule {
  static forRoot(): ModuleWithProviders<DatepickerModule> {
    return {
      ngModule: DatepickerModule,
      providers: [{ provide: DATEPICKER_LOCALE, useExisting: LOCALE_ID }],
    };
  }
}

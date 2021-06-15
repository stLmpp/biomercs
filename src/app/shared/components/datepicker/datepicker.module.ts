import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDaysComponent } from './calendar-days/calendar-days.component';
import { ButtonModule } from '@shared/components/button/button.module';
import { DateModule } from '@shared/date/date.module';
import { CalendarAdapter } from '@shared/components/datepicker/calendar-adapter';
import { CalendarMonthsComponent } from './calendar-months/calendar-months.component';
import { CalendarYearsComponent } from './calendar-years/calendar-years.component';
import { CALENDAR_LOCALE } from '@shared/components/datepicker/calendar-locale.token';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CalendarFooterDirective } from './calendar/calendar-footer.directive';
import { CalendarFooterTodayDirective } from './calendar/calendar-footer-today.directive';
import { CalendarFooterClearDirective } from './calendar/calendar-footer-clear.directive';
import { A11yModule } from '@angular/cdk/a11y';
import { DatepickerDirective } from './datepicker/datepicker.directive';
import { BioCommonModule } from '@shared/components/common/bio-common.module';
import { DatepickerTriggerDirective } from './datepicker/datepicker-trigger.directive';

@NgModule({
  declarations: [
    CalendarComponent,
    CalendarDaysComponent,
    CalendarMonthsComponent,
    CalendarYearsComponent,
    DatepickerComponent,
    CalendarFooterDirective,
    CalendarFooterTodayDirective,
    CalendarFooterClearDirective,
    DatepickerDirective,
    DatepickerTriggerDirective,
  ],
  exports: [
    CalendarComponent,
    ButtonModule,
    CalendarFooterDirective,
    CalendarFooterTodayDirective,
    CalendarFooterClearDirective,
    BioCommonModule,
    DatepickerComponent,
    DatepickerDirective,
    DatepickerTriggerDirective,
  ],
  imports: [ButtonModule, DateModule, A11yModule, BioCommonModule],
})
export class DatepickerModule {
  static forRoot(): ModuleWithProviders<DatepickerModule> {
    return {
      ngModule: DatepickerModule,
      providers: [{ provide: CALENDAR_LOCALE, useExisting: LOCALE_ID }, CalendarAdapter],
    };
  }
}

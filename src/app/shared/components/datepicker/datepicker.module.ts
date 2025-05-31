import { NgModule } from '@angular/core';
import { CalendarComponent } from './calendar/calendar.component';
import { CalendarDaysComponent } from './calendar-days/calendar-days.component';
import { ButtonModule } from '@shared/components/button/button.module';

import { CalendarMonthsComponent } from './calendar-months/calendar-months.component';
import { CalendarYearsComponent } from './calendar-years/calendar-years.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { CalendarFooterDirective } from './calendar/calendar-footer.directive';
import { CalendarFooterTodayDirective } from './calendar/calendar-footer-today.directive';
import { CalendarFooterClearDirective } from './calendar/calendar-footer-clear.directive';
import { A11yModule } from '@angular/cdk/a11y';
import { DatepickerDirective } from './datepicker/datepicker.directive';
import { BioCommonModule } from '@shared/components/common/bio-common.module';
import { DatepickerTriggerDirective } from './datepicker/datepicker-trigger.directive';

const DECLARATIONS = [
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
];

const IMPORTS = [ButtonModule, A11yModule, BioCommonModule];

@NgModule({
  imports: [...IMPORTS, ...DECLARATIONS],
  exports: [...DECLARATIONS, ...IMPORTS],
})
export class DatepickerModule {}

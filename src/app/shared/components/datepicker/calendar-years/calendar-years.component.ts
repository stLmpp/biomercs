import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DatepickerYear } from '@shared/components/datepicker/datepicker';
import { CalendarKeyboardNavigation } from '@shared/components/datepicker/calendar-keyboard-navigation';

@Component({
  selector: 'bio-calendar-years',
  templateUrl: './calendar-years.component.html',
  styleUrls: ['./calendar-years.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarYearsComponent extends CalendarKeyboardNavigation {
  @Input() value: Date | null | undefined;
  @Input() years: DatepickerYear[] = [];

  trackBy = DatepickerYear.trackBy;
  todayYear = new Date().getFullYear();

  handleArrowDown($event: KeyboardEvent): void {}

  handleArrowLeft($event: KeyboardEvent): void {}

  handleArrowRight($event: KeyboardEvent): void {}

  handleArrowUp($event: KeyboardEvent): void {}

  handleEnter($event: KeyboardEvent): void {}

  handlePageDown($event: KeyboardEvent): void {}

  handlePageUp($event: KeyboardEvent): void {}
}

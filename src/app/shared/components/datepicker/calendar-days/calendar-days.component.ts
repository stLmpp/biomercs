import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CalendarDay } from '@shared/components/datepicker/calendar-day';
import { trackByFactory } from '@stlmpp/utils';
import {
  addDays,
  addMonths,
  addYears,
  daysInWeek,
  endOfMonth,
  getDaysInMonth,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  setDate,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import { CalendarAdapter } from '@shared/components/datepicker/calendar-adapter';
import { CalendarKeyboardNavigation } from '@shared/components/datepicker/calendar-keyboard-navigation';
import { ButtonComponent } from '../../button/button.component';
import { DateEqualPipe } from '../../../date/date-equal.pipe';

@Component({
  selector: 'bio-calendar-days',
  templateUrl: './calendar-days.component.html',
  styleUrls: ['./calendar-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CalendarKeyboardNavigation, useExisting: CalendarDaysComponent }],
  imports: [ButtonComponent, DateEqualPipe],
})
export class CalendarDaysComponent extends CalendarKeyboardNavigation {
  private readonly calendarAdapter = inject(CalendarAdapter);

  readonly value = input<Date | null>();
  readonly days = input<CalendarDay[]>([]);
  readonly dayNames = input<string[]>([]);
  readonly disabled = input(false);

  readonly valueChange = output<Date | null | undefined>();
  readonly nextMonth = output<void>();
  readonly previousMonth = output<void>();
  readonly nextYear = output<void>();
  readonly previousYear = output<void>();

  readonly nowDate = new Date();

  readonly trackByString = trackByFactory<string>();
  readonly trackByDay = CalendarDay.trackBy;

  private _daySelected(day: CalendarDay): void {
    this.value = day.date;
    this.valueChange.emit(this.value());
  }

  private _getActiveIndexAndItem(): [number, CalendarDay] {
    const activeItemIndex = this.focusKeyManager.activeItemIndex ?? 0;
    const item = this.days()[activeItemIndex];
    return [activeItemIndex, item];
  }

  private _setActiveWithTimeout(day: number, date: Date): void {
    const daysInMonth = getDaysInMonth(date);
    let index: number;
    if (day > daysInMonth) {
      index = this.calendarAdapter.findIndex(endOfMonth(date));
    } else {
      index = this.calendarAdapter.findIndex(setDate(date, day));
    }
    setTimeout(() => {
      this.focusKeyManager.setActiveItem(index);
    });
  }

  handleArrowRight(): void {
    const [, item] = this._getActiveIndexAndItem();
    if (isLastDayOfMonth(item.date)) {
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setFirstItemActive();
      });
    } else {
      this.focusKeyManager.setNextItemActive();
    }
  }

  handleArrowLeft(): void {
    const [, item] = this._getActiveIndexAndItem();
    if (isFirstDayOfMonth(item.date)) {
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setLastItemActive();
      });
    } else {
      this.focusKeyManager.setPreviousItemActive();
    }
  }

  handleArrowDown(): void {
    const [activeItemIndex, item] = this._getActiveIndexAndItem();
    const daysInMonth = getDaysInMonth(item.date);
    if (item.day + daysInWeek > daysInMonth) {
      const nextIndex = this.calendarAdapter.findIndex(addDays(item.date, daysInWeek));
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setActiveItem(nextIndex);
      });
    } else {
      this.focusKeyManager.setActiveItem(activeItemIndex + daysInWeek);
    }
  }

  handleArrowUp(): void {
    const [activeItemIndex, item] = this._getActiveIndexAndItem();
    if (item.day - daysInWeek <= 0) {
      const previousIndex = this.calendarAdapter.findIndex(subDays(item.date, daysInWeek));
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setActiveItem(previousIndex);
      });
    } else {
      this.focusKeyManager.setActiveItem(activeItemIndex - daysInWeek);
    }
  }

  handleEnter(): void {
    const item = this.days()[this.focusKeyManager.activeItemIndex ?? -1];
    if (item && item.date !== this.value()) {
      this._daySelected(item);
    }
  }

  override handleEnd(): void {
    this.focusKeyManager.setLastItemActive();
  }

  override handleHome(): void {
    this.focusKeyManager.setFirstItemActive();
  }

  handlePageDown($event: KeyboardEvent): void {
    const [, item] = this._getActiveIndexAndItem();
    let nextDate: Date;
    if ($event.altKey) {
      nextDate = addYears(item.date, 1);
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextYear.emit();
    } else {
      nextDate = addMonths(item.date, 1);
      // TODO: The 'emit' function requires a mandatory void argument
      this.nextMonth.emit();
    }
    this._setActiveWithTimeout(item.day, nextDate);
  }

  handlePageUp($event: KeyboardEvent): void {
    const [, item] = this._getActiveIndexAndItem();
    let previousDate: Date;
    if ($event.altKey) {
      previousDate = subYears(item.date, 1);
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousYear.emit();
    } else {
      previousDate = subMonths(item.date, 1);
      // TODO: The 'emit' function requires a mandatory void argument
      this.previousMonth.emit();
    }
    this._setActiveWithTimeout(item.day, previousDate);
  }

  onClick(day: CalendarDay, index: number): void {
    if (this.value() === day.date) {
      return;
    }
    this._daySelected(day);
    this.focusKeyManager.setActiveItem(index);
  }
}

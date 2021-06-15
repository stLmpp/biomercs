import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatepickerDay } from '@shared/components/datepicker/datepicker';
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

@Component({
  selector: 'bio-calendar-days',
  templateUrl: './calendar-days.component.html',
  styleUrls: ['./calendar-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CalendarKeyboardNavigation, useExisting: CalendarDaysComponent }],
})
export class CalendarDaysComponent extends CalendarKeyboardNavigation {
  constructor(private readonly calendarAdapter: CalendarAdapter) {
    super();
  }

  @Input() value: Date | null | undefined;
  @Input() days: DatepickerDay[] = [];
  @Input() dayNames: string[] = [];

  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();
  @Output() readonly nextMonth = new EventEmitter<void>();
  @Output() readonly previousMonth = new EventEmitter<void>();
  @Output() readonly nextYear = new EventEmitter<void>();
  @Output() readonly previousYear = new EventEmitter<void>();

  readonly nowDate = new Date();

  readonly trackByString = trackByFactory<string>();
  readonly trackByDay = DatepickerDay.trackBy;

  private _daySelected(day: DatepickerDay): void {
    this.value = day.date;
    this.valueChange.emit(this.value);
  }

  private _getActiveIndexAndItem(): [number, DatepickerDay] {
    const activeItemIndex = this.focusKeyManager.activeItemIndex ?? 0;
    const item = this.days[activeItemIndex];
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
      this.previousMonth.emit();
      setTimeout(() => {
        this.focusKeyManager.setActiveItem(previousIndex);
      });
    } else {
      this.focusKeyManager.setActiveItem(activeItemIndex - daysInWeek);
    }
  }

  handleEnter(): void {
    const item = this.days[this.focusKeyManager.activeItemIndex ?? -1];
    if (item && item.date !== this.value) {
      this._daySelected(item);
    }
  }

  handleEnd(): void {
    this.focusKeyManager.setLastItemActive();
  }

  handleHome(): void {
    this.focusKeyManager.setFirstItemActive();
  }

  handlePageDown($event: KeyboardEvent): void {
    const [, item] = this._getActiveIndexAndItem();
    let nextDate: Date;
    if ($event.altKey) {
      nextDate = addYears(item.date, 1);
      this.nextYear.emit();
    } else {
      nextDate = addMonths(item.date, 1);
      this.nextMonth.emit();
    }
    this._setActiveWithTimeout(item.day, nextDate);
  }

  handlePageUp($event: KeyboardEvent): void {
    const [, item] = this._getActiveIndexAndItem();
    let previousDate: Date;
    if ($event.altKey) {
      previousDate = subYears(item.date, 1);
      this.previousYear.emit();
    } else {
      previousDate = subMonths(item.date, 1);
      this.previousMonth.emit();
    }
    this._setActiveWithTimeout(item.day, previousDate);
  }

  onClick(day: DatepickerDay, index: number): void {
    this._daySelected(day);
    this.focusKeyManager.setActiveItem(index);
  }
}

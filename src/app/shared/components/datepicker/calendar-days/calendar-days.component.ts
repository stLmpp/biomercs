import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { DatepickerDay } from '@shared/components/datepicker/datepicker';
import { trackByFactory } from '@stlmpp/utils';
import { ButtonComponent } from '@shared/components/button/button.component';
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Key } from '@model/enum/key';
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

@Component({
  selector: 'bio-calendar-days',
  templateUrl: './calendar-days.component.html',
  styleUrls: ['./calendar-days.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarDaysComponent implements AfterViewInit {
  constructor(private calendarAdapter: CalendarAdapter) {}

  @ViewChildren(ButtonComponent) buttons!: QueryList<ButtonComponent>;

  @Input() value: Date | null | undefined;
  @Output() readonly valueChange = new EventEmitter<Date | null | undefined>();
  @Input() days: DatepickerDay[] = [];
  @Input() dayNames: string[] = [];

  @Output() readonly nextMonth = new EventEmitter<void>();
  @Output() readonly previousMonth = new EventEmitter<void>();
  @Output() readonly nextYear = new EventEmitter<void>();
  @Output() readonly previousYear = new EventEmitter<void>();

  focusKeyManager!: FocusKeyManager<ButtonComponent>;

  nowDate = new Date();

  trackByString = trackByFactory<string>();
  trackByDay = DatepickerDay.trackBy;

  private _daySelected(day: DatepickerDay): void {
    this.value = day.date;
    this.valueChange.emit(this.value);
  }

  private _getActiveIndexAndItem(): [number, DatepickerDay] {
    const activeItemIndex = this.focusKeyManager.activeItemIndex ?? 0;
    const item = this.days[activeItemIndex];
    return [activeItemIndex, item];
  }

  private _handleArrayRight(): void {
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

  private _handleArrowLeft(): void {
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

  private _handleArrowDown(): void {
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

  private _handleArrowUp(): void {
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

  private _handleEnter(): void {
    const item = this.days[this.focusKeyManager.activeItemIndex ?? -1];
    if (item && item.date !== this.value) {
      this._daySelected(item);
    }
  }

  private _handleEnd(): void {
    this.focusKeyManager.setLastItemActive();
  }

  private _handleHome(): void {
    this.focusKeyManager.setFirstItemActive();
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

  private _handlePageDown($event: KeyboardEvent): void {
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

  private _handlePageUp($event: KeyboardEvent): void {
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

  @HostListener('keydown', ['$event'])
  onKeydown($event: KeyboardEvent): void {
    switch ($event.key) {
      case Key.ArrowRight:
        this._handleArrayRight();
        break;
      case Key.ArrowLeft:
        this._handleArrowLeft();
        break;
      case Key.ArrowDown:
        this._handleArrowDown();
        break;
      case Key.ArrowUp:
        this._handleArrowUp();
        break;
      case Key.Enter: {
        this._handleEnter();
        break;
      }
      case Key.Home: {
        this._handleHome();
        break;
      }
      case Key.End: {
        this._handleEnd();
        break;
      }
      case Key.PageDown: {
        this._handlePageDown($event);
        break;
      }
      case Key.PageUp: {
        this._handlePageUp($event);
        break;
      }
    }
  }

  onClick(day: DatepickerDay, index: number): void {
    this._daySelected(day);
    this.focusKeyManager.setActiveItem(index);
  }

  ngAfterViewInit(): void {
    this.focusKeyManager = new FocusKeyManager<ButtonComponent>(this.buttons);
    this.focusKeyManager.setFirstItemActive();
  }
}

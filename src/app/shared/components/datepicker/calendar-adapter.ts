import { Injectable } from '@angular/core';
import {
  addMonths,
  daysInWeek,
  endOfMonth,
  getDaysInMonth,
  isWeekend,
  monthsInYear,
  setDay,
  setMonth,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { CalendarDay } from '@shared/components/datepicker/calendar-day';
import { dateEqual } from '@shared/date/date-equal.pipe';
import { CalendarMonth } from '@shared/components/datepicker/calendar-month';

@Injectable({ providedIn: 'root' })
export class CalendarAdapter {
  private readonly _cacheDaysCalendar = new Map<string, CalendarDay[]>();

  getDaysCalendar(date: Date): CalendarDay[] {
    const year = date.getFullYear();
    const month = date.getMonth();
    const key = `${year}-${month}`;
    // Check if the return value was cached before, if so, returns it
    if (this._cacheDaysCalendar.has(key)) {
      return this._cacheDaysCalendar.get(key)!;
    }
    // Get the padding days of last month
    let padStart = startOfMonth(date).getDay();
    // Get the padding days of the next month
    let padEnd = Math.min(7 - endOfMonth(date).getDay() - 1, daysInWeek - 1);
    // Get number of days in the month
    const daysInMonth = getDaysInMonth(date);
    // Create an array of days in the month
    const days: CalendarDay[] = Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const dayDate = new Date(year, month, day);
      return new CalendarDay(dayDate, isWeekend(dayDate));
    });
    // Verify if the total of days has at least 6 weeks
    if ((days.length + padStart + padEnd) / daysInWeek < 6) {
      // If the padStart is 0, add padding to the start
      if (!padStart) {
        padStart += daysInWeek;
      } else {
        padEnd += daysInWeek;
      }
    }
    if (padStart) {
      // If has padStart, simply add the days to the beginning of the array
      const lastMonthDate = endOfMonth(subMonths(date, 1));
      let day = lastMonthDate.getDate();
      days.unshift(
        ...Array.from({ length: padStart }, () => {
          const newDay = day--;
          const dayDate = new Date(lastMonthDate);
          dayDate.setDate(newDay);
          return new CalendarDay(dayDate, isWeekend(dayDate), true);
        }).reverse()
        // Reverse because the days are inserted backwards
      );
    }
    if (padEnd) {
      // If has padEnd, add the days to the end of the array
      let day = 1;
      const nextMonth = addMonths(date, 1);
      days.push(
        ...Array.from({ length: padEnd }, () => {
          const newDay = day++;
          const dayDate = new Date(nextMonth);
          dayDate.setDate(newDay);
          return new CalendarDay(dayDate, isWeekend(dayDate), true);
        })
      );
    }
    // Set the cache for future calls
    this._cacheDaysCalendar.set(key, days);
    return days;
  }

  getMonthsCalendar(locale: string): CalendarMonth[] {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
    const date = new Date();
    return Array.from(
      { length: monthsInYear },
      (_, index) => new CalendarMonth(index, formatter.format(setMonth(date, index)))
    );
  }

  getYearsCalendar(date: Date): number[] {
    const year = date.getFullYear();
    const mod = year % 24;
    let firstYear = year - mod;
    return Array.from({ length: 24 }, () => firstYear++);
  }

  getDayNames(locale: string): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
    const date = new Date();
    return Array.from({ length: daysInWeek }, (_, index) => formatter.format(setDay(date, index)));
  }

  findIndex(date: Date): number {
    const daysArray = this.getDaysCalendar(date);
    return daysArray.findIndex(day => dateEqual(date, day.date));
  }
}

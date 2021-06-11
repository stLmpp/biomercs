import {
  addMonths,
  daysInWeek,
  endOfMonth,
  getDaysInMonth,
  isWeekend,
  monthsInYear,
  startOfMonth,
  subMonths,
} from 'date-fns';
import { DatepickerDay } from '@shared/components/datepicker/datepicker';

const map = new Map<string, DatepickerDay[]>();

export function getDaysArray(date: Date): DatepickerDay[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const key = `${year}-${month}`;
  if (map.has(key)) {
    return map.get(key)!;
  }
  const padStart = startOfMonth(date).getDay();
  let padEnd = 7 - (endOfMonth(date).getDay() + 1);
  const daysInMonth = getDaysInMonth(date);
  const days: DatepickerDay[] = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    return new DatepickerDay(day, isWeekend(new Date(year, month, day)));
  });
  if (padStart && padStart < 6) {
    const lastMonthDate = endOfMonth(subMonths(date, 1));
    let day = lastMonthDate.getDate();
    days.unshift(
      ...Array.from({ length: padStart }, () => {
        const newDay = day--;
        return new DatepickerDay(newDay, isWeekend(new Date(lastMonthDate).setDate(newDay)), true);
      }).reverse()
    );
  }
  if (padEnd < 6) {
    padEnd += 7;
  }
  if (padEnd < 12) {
    let day = 1;
    const nextMonth = addMonths(date, 1);
    days.push(
      ...Array.from({ length: padEnd }, () => {
        const newDay = day++;
        return new DatepickerDay(newDay, isWeekend(new Date(nextMonth).setDate(newDay)), true);
      })
    );
  }
  map.set(key, days);
  return days;
}

export function getMonths(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  return Array.from({ length: monthsInYear }).map((_, index) => formatter.format(new Date().setMonth(index)));
}

export function getDayNames(locale: string): string[] {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'narrow' });
  return Array.from({ length: daysInWeek }, (_, index) => formatter.format(new Date(2017, 0, index + 1)));
}

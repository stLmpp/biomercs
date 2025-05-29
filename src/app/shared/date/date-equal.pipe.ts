import { Pipe, PipeTransform } from '@angular/core';
import {
  isEqual,
  isValid,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfSecond,
  startOfYear,
} from 'date-fns';

export type DateEqualPipeCompareType = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

const dateEqualPipeTransformer: { [K in DateEqualPipeCompareType]: (value: Date) => Date } = {
  second: startOfSecond,
  minute: startOfMinute,
  hour: startOfHour,
  day: startOfDay,
  month: startOfMonth,
  year: startOfYear,
};

export function dateEqual(
  date1: Date | null | undefined,
  date2: Date | null | undefined,
  compare: DateEqualPipeCompareType = 'day'
): boolean {
  if (!date1 || !date2 || !isValid(date1) || !isValid(date2)) {
    return false;
  }
  const transformer = dateEqualPipeTransformer[compare];
  return isEqual(transformer(date1), transformer(date2));
}

@Pipe({
    name: 'dateEqual',
    standalone: false
})
export class DateEqualPipe implements PipeTransform {
  transform(
    date1: Date | null | undefined,
    date2: Date | null | undefined,
    compare: DateEqualPipeCompareType = 'day'
  ): boolean {
    return dateEqual(date1, date2, compare);
  }
}

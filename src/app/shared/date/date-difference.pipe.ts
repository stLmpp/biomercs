import { Pipe, PipeTransform } from '@angular/core';
import { isArray, isObject } from 'st-utils';
import { differenceInHours } from 'date-fns';

export interface DateDifferencePipeOptions {
  days?: boolean;
  hours?: boolean;
}

export type DateDifferencePipeOptionsKey = keyof DateDifferencePipeOptions;
export type DateDifferencePipeOptionsKeys = DateDifferencePipeOptionsKey[];

function resolveOptions(
  options: DateDifferencePipeOptions | DateDifferencePipeOptionsKey | DateDifferencePipeOptionsKeys
): DateDifferencePipeOptions {
  if (isArray(options)) {
    return options.reduce((acc, item) => ({ ...acc, [item]: true }), {});
  } else if (isObject(options)) {
    return options;
  } else {
    return { [options]: true };
  }
}

function pluralize(unit: string, count: number): string {
  return `${unit}${count === 1 ? '' : 's'}`;
}

export function dateDifference(
  value: Date | undefined | null,
  compare: Date | undefined | null,
  _options: DateDifferencePipeOptions | DateDifferencePipeOptionsKey | DateDifferencePipeOptionsKeys
): string {
  if (!value || !compare) {
    return '';
  }
  const options = resolveOptions(_options);
  let hours = differenceInHours(value, compare);
  const days = Math.floor(hours / 24);
  const units: string[] = [];
  const hasDays = options.days && days;
  if (hasDays) {
    units.push(`${days} ${pluralize('day', days)}`);
  }
  const hasHours = options.hours && hours;
  if (hasHours) {
    if (hasDays) {
      hours -= days * 24;
    }
    units.push(`${hours} ${pluralize('hour', hours)}`);
  }
  return units.join(' and ');
}

@Pipe({ name: 'dateDifference' })
export class DateDifferencePipe implements PipeTransform {
  transform(
    value: Date | undefined | null,
    compare: Date | undefined | null,
    _options: DateDifferencePipeOptions | DateDifferencePipeOptionsKey | DateDifferencePipeOptionsKeys
  ): string {
    return dateDifference(value, compare, _options);
  }
}

import { filter, OperatorFunction } from 'rxjs';
import { isNotNil } from 'st-utils';

export function filterNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return filter(isNotNil);
}

export function filterArrayMinLength<T extends any[]>(length = 1): OperatorFunction<T, T> {
  return filter(array => array.length >= length);
}

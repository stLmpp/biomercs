import { OperatorFunction } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isNil } from 'st-utils';

export function isNotNil<T>(value: T): value is NonNullable<T> {
  return !isNil(value);
}

export function filterNil<T>(): OperatorFunction<T, NonNullable<T>> {
  return filter(isNotNil);
}

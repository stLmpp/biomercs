import { isNotNil } from 'st-utils';
import { filter, OperatorFunction } from 'rxjs';
import { Nullable } from '@shared/type/nullable';

function filterNilArray<T>(array: T[]): array is NonNullable<T>[] {
  return array.every(isNotNil);
}

export function filterNilArrayOperator(): OperatorFunction<Nullable<number>[], NonNullable<number>[]> {
  return filter(filterNilArray);
}

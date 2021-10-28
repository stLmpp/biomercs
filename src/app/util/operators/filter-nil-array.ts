import { isNotNil } from 'st-utils';
import { filter, OperatorFunction } from 'rxjs';

function filterNilArray<T>(array: T[]): array is NonNullable<T>[] {
  return array.every(isNotNil);
}

export function filterNilArrayOperator(): OperatorFunction<Array<number | null | undefined>, NonNullable<number>[]> {
  return filter(filterNilArray);
}

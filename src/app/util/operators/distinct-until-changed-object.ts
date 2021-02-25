import { MonoTypeOperatorFunction } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { isNil } from 'st-utils';

export function distinctUntilChangedObject<T>(): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged(isEqualObject);
}

export function isEqualObject<T extends Record<any, any>>(paramsA: T, paramsB: T): boolean {
  if (isNil(paramsA) || isNil(paramsB)) {
    return false;
  }
  const keysA = Object.keys(paramsA);
  const keysB = Object.keys(paramsB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  let index = keysA.length;
  while (index--) {
    const key = keysA[index];
    if (paramsA[key] !== paramsB[key]) {
      return false;
    }
  }
  return true;
}

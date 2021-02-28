import { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, pluck, takeUntil } from 'rxjs/operators';
import { Directive } from '@angular/core';
import { Destroyable } from './destroyable-component';
import { isFunction, isObject } from 'st-utils';
import { Entries } from '@stlmpp/store';

@Directive()
export abstract class StateComponent<T extends Record<string, any> = Record<string, any>> extends Destroyable {
  protected constructor(initialState: T) {
    super();
    this._state$ = new BehaviorSubject(initialState);
    this._updateQueue$
      .pipe(
        takeUntil(this.destroy$),
        filter(updates => !!updates.length),
        auditTime(0)
      )
      .subscribe(updates => {
        this._updateQueue$.next([]);
        const state = { ...this._state$.value };
        const newState = updates.reduce((acc, item) => item(acc), state);
        this._state$.next(newState);
      });
  }

  private _state$: BehaviorSubject<T>;
  private _updateQueue$ = new BehaviorSubject<((state: T) => T)[]>([]);

  private _updateQueue(callback: (state: T) => T): void {
    this._updateQueue$.next([...this._updateQueue$.value, callback]);
  }

  updateState(partial: Partial<T> | ((state: T) => T)): void;
  updateState<K extends keyof T>(key: K, value: T[K] | ((state: T[K] | undefined) => T[K])): void;
  updateState<K extends keyof T>(
    key: K | Partial<T> | ((state: T) => T),
    value?: T[K] | ((state: T[K] | undefined) => T[K])
  ): void {
    if (isFunction(key) || isObject(key)) {
      const callback = isFunction(key) ? key : (state: T) => ({ ...state, ...key });
      this._updateQueue(callback);
    } else {
      const callback = isFunction(value) ? value : () => value;
      this._updateQueue(state => ({ ...state, [key]: callback(state[key]) }));
    }
  }

  selectState(): Observable<T>;
  selectState<K extends keyof T>(key: K): Observable<T[K]>;
  selectState<K extends keyof T>(key?: K): Observable<T[K] | T> {
    let state$: Observable<any> = this._state$.asObservable();
    if (key) {
      state$ = state$.pipe(pluck(key));
    }
    return state$.pipe(distinctUntilChanged());
  }

  selectStateMulti<K extends keyof T>(keys: K[]): Observable<Pick<T, K>> {
    return this._state$.pipe(
      distinctUntilKeysChanged(keys),
      map(state =>
        (Object.entries(state) as Entries<T, K>).reduce(
          (acc, [key, value]) => (keys.includes(key) ? { ...acc, [key]: value } : acc),
          {} as Pick<T, K>
        )
      )
    );
  }

  getState(): T;
  getState<K extends keyof T>(key: K): T[K];
  getState<K extends keyof T>(key?: K): T | T[K] {
    return key ? this._state$.value[key] : this._state$.value;
  }
}

export function distinctUntilKeysChanged<T extends Record<string, any>, K extends keyof T>(
  keys: K[]
): OperatorFunction<T, T> {
  return distinctUntilChanged((valueA, valueB) => {
    let index = keys.length;
    while (index--) {
      const key = keys[index];
      if (valueA[key] !== valueB[key]) {
        return false;
      }
    }
    return true;
  });
}

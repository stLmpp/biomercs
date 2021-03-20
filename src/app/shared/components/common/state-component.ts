import { BehaviorSubject, Observable, queueScheduler, SchedulerLike } from 'rxjs';
import { distinctUntilChanged, filter, map, observeOn, pluck, takeUntil } from 'rxjs/operators';
import { Directive, OnChanges } from '@angular/core';
import { Destroyable } from './destroyable-component';
import { isFunction, isObject, isObjectEmpty } from 'st-utils';
import { Entries } from '@stlmpp/store';
import { distinctUntilKeysChanged } from '@util/operators/distinct-until-keys-changed';
import { SimpleChangesCustom } from '@util/util';

export interface StateComponentConfig<K extends keyof any> {
  inputs?: K[];
  scheduler?: SchedulerLike;
}

@Directive()
export abstract class StateComponent<T extends Record<string, any> = Record<string, any>>
  extends Destroyable
  implements OnChanges {
  protected constructor(initialState: T, config: StateComponentConfig<keyof T> = {}) {
    super();
    this._inputs = config.inputs ?? [];
    this._state$ = new BehaviorSubject(initialState);
    this._updateQueue$
      .pipe(
        observeOn(config.scheduler ?? queueScheduler),
        takeUntil(this.destroy$),
        filter(updates => !!updates.length)
      )
      .subscribe(updates => {
        const state = { ...this._state$.value };
        const newState = updates.reduce((acc, item) => item(acc), state);
        this._state$.next(newState);
        this._updateQueue$.next([]);
      });
  }

  private readonly _inputs: (keyof T)[];
  private readonly _state$: BehaviorSubject<T>;
  private readonly _updateQueue$ = new BehaviorSubject<((state: T) => T)[]>([]);

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

  ngOnChanges(changes: SimpleChangesCustom): void {
    let stateUpdate: Partial<T> = {};
    for (const input of this._inputs) {
      const inputChanges = changes[input];
      if (inputChanges && inputChanges.currentValue !== inputChanges.previousValue) {
        stateUpdate = { ...stateUpdate, [input]: inputChanges.currentValue };
      }
    }
    if (!isObjectEmpty(stateUpdate)) {
      this.updateState(stateUpdate);
    }
  }
}

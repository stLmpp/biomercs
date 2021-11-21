import { Directive, OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Subject, takeUntil } from 'rxjs';

@Directive()
export abstract class Destroyable implements OnDestroy {
  protected readonly destroy$ = new Subject<void>();

  takeUntilDestroy<T>(): MonoTypeOperatorFunction<T> {
    return takeUntil(this.destroy$);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

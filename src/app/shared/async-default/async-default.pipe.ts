import { Pipe, PipeTransform } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, Subscribable } from 'rxjs';

@Pipe({ name: 'asyncDefault', pure: false })
export class AsyncDefaultPipe extends AsyncPipe implements PipeTransform {
  override transform<T>(obj: Observable<T> | Subscribable<T> | Promise<T>): T | null;
  override transform<T>(obj: null | undefined): null;
  override transform<T>(obj: Observable<T> | Subscribable<T> | Promise<T> | null | undefined): T | null;
  override transform<T, R = T>(
    obj: Observable<T> | Subscribable<T> | Promise<T> | null | undefined,
    defaultValue: R
  ): T | R;
  override transform<T, R = T>(
    obj: Observable<T> | Subscribable<T> | Promise<T> | null | undefined,
    defaultValue?: R
  ): T | R | null {
    return super.transform(obj) ?? defaultValue ?? null;
  }
}

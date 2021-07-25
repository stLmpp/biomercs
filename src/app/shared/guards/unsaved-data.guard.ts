import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { isObservable, Observable, of, switchMap, take } from 'rxjs';
import { isNil, isObject, isString } from 'st-utils';
import { DialogService } from '@shared/components/modal/dialog/dialog.service';
import { DialogData } from '@shared/components/modal/dialog/dialog.component';

export type UnsavedDataType = string | boolean | DialogData | null;

export interface UnsavedData {
  hasUnsavedData(
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): UnsavedDataType | Observable<UnsavedDataType>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedDataGuard<T extends UnsavedData = any> implements CanDeactivate<T> {
  constructor(private dialogService: DialogService) {}

  private _resolveData(data: UnsavedDataType): Observable<boolean> {
    if (isNil(data) || data === false) {
      return of(true);
    }
    if (isString(data)) {
      return this.dialogService.confirm({ content: data });
    }
    if (isObject(data)) {
      return this.dialogService.confirm(data);
    }
    return this.dialogService.confirm({ title: 'Leave page', content: 'There might be unsaved data' });
  }

  canDeactivate(
    component: T,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!component.hasUnsavedData) {
      return true;
    }
    const hasUnsavedData = component.hasUnsavedData(currentRoute, currentState, nextState);
    if (isObservable(hasUnsavedData)) {
      return hasUnsavedData.pipe(
        take(1),
        switchMap(data => this._resolveData(data))
      );
    } else {
      return this._resolveData(hasUnsavedData);
    }
  }
}

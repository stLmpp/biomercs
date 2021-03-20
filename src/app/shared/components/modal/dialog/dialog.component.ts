import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ModalRef } from '../modal-ref';
import { BehaviorSubject, isObservable, Observable } from 'rxjs';
import { MODAL_DATA } from '../modal.config';
import { take, takeUntil } from 'rxjs/operators';
import { Destroyable } from '../../common/destroyable-component';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { isFunction } from 'st-utils';

export interface DialogData {
  title?: string | null;
  content: string | SafeHtml;
  btnYes?: string | null;
  btnNo?: string | null;
  yesAction?: ((modalRef: ModalRef<DialogComponent, DialogData, boolean>) => any) | Observable<any>;
  noAction?: ((modalRef: ModalRef<DialogComponent, DialogData, boolean>) => any) | Observable<any>;
}

@Component({
  selector: 'bio-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent extends Destroyable {
  constructor(
    private modalRef: ModalRef<DialogComponent, DialogData, boolean>,
    @Inject(MODAL_DATA) public data: DialogData
  ) {
    super();
  }

  loading$ = new BehaviorSubject<boolean>(false);

  private _proccessObservable(observable: Observable<any>, action: boolean): void {
    this.loading$.next(true);
    observable
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        catchAndThrow(() => {
          this.loading$.next(false);
        })
      )
      .subscribe(() => {
        this.loading$.next(false);
        this.modalRef.close(action);
      });
  }

  yes(): void {
    if (isObservable(this.data.yesAction)) {
      this._proccessObservable(this.data.yesAction, true);
    } else if (isFunction(this.data.yesAction)) {
      const result = this.data.yesAction(this.modalRef);
      if (isObservable(result)) {
        this._proccessObservable(result, true);
      }
    } else {
      this.modalRef.close(true);
    }
  }

  no(): void {
    if (isObservable(this.data.noAction)) {
      this._proccessObservable(this.data.noAction, false);
    } else if (isFunction(this.data.noAction)) {
      const result = this.data.noAction(this.modalRef);
      if (isObservable(result)) {
        this._proccessObservable(result, false);
      }
    } else {
      this.modalRef.close(false);
    }
  }
}

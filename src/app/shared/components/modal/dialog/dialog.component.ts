import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ModalRef } from '../modal-ref';
import { isObservable, Observable } from 'rxjs';
import { MODAL_DATA } from '../modal.config';
import { take, takeUntil } from 'rxjs/operators';
import { catchAndThrow } from '@util/operators/catch-and-throw';
import { isFunction } from 'st-utils';
import { LocalState } from '@stlmpp/store';

export enum DialogType {
  confirm,
  success,
  info,
  error,
}

export interface DialogData {
  title?: string | null;
  content: string | SafeHtml;
  btnYes?: string | null;
  btnNo?: string | null;
  yesAction?: ((modalRef: ModalRef<DialogComponent, DialogData, boolean>) => any) | Observable<any>;
  noAction?: ((modalRef: ModalRef<DialogComponent, DialogData, boolean>) => any) | Observable<any>;
  type?: DialogType;
}

@Component({
  selector: 'bio-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent extends LocalState<{ loadingYes: boolean; loadingNo: boolean }> {
  constructor(
    private modalRef: ModalRef<DialogComponent, DialogData, boolean>,
    @Inject(MODAL_DATA) public data: DialogData
  ) {
    super({ loadingNo: false, loadingYes: false });
  }

  state$ = this.selectState();

  dialogType = DialogType;
  typesWithoutIcon = [DialogType.confirm, DialogType.info];

  @HostBinding('class.success')
  get successClass(): boolean {
    return this.data.type === DialogType.success;
  }

  @HostBinding('class.confirmation')
  get confirmationClass(): boolean {
    return this.data.type === DialogType.confirm;
  }

  @HostBinding('class.error')
  get errorClass(): boolean {
    return this.data.type === DialogType.error;
  }

  private _setLoading(action: boolean, loading: boolean): void {
    const stateKey = action ? 'loadingYes' : 'loadingNo';
    this.updateState({ [stateKey]: loading });
  }

  private _proccessObservable(observable: Observable<any>, action: boolean): void {
    this._setLoading(action, true);
    observable
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        catchAndThrow(() => {
          this._setLoading(action, false);
        })
      )
      .subscribe(() => {
        this._setLoading(action, false);
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

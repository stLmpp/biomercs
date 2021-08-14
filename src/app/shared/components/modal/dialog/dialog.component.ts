import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { ModalRef } from '../modal-ref';
import { filter, finalize, isObservable, Observable, take, takeUntil, tap } from 'rxjs';
import { MODAL_DATA } from '../modal.config';
import { isBoolean, isFunction, isNotNil, isString } from 'st-utils';
import { DialogData, DialogDataButton, DialogDataButtonType } from '@shared/components/modal/dialog/dialog-data';
import { DialogType } from '@shared/components/modal/dialog/dialog-type.enum';
import { trackById } from '@util/track-by';
import { Destroyable } from '@shared/components/common/destroyable-component';

let uid = 1;

interface DialogDataButtonInternal extends DialogDataButton {
  id: number;
  disabled: boolean;
  loading: boolean;
}

function mapDialogDataButtonToInternal(buttons: DialogDataButtonType[] | undefined): DialogDataButtonInternal[] {
  return (
    buttons?.map(button => {
      let internalButton: DialogDataButtonInternal = { id: uid++, title: '', loading: false, disabled: false };
      if (isString(button)) {
        internalButton.title = button;
      } else {
        internalButton = { ...internalButton, ...button };
      }
      return internalButton;
    }) ?? []
  );
}

@Component({
  selector: 'bio-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent extends Destroyable implements OnInit {
  constructor(
    private modalRef: ModalRef<DialogComponent, DialogData, boolean>,
    @Inject(MODAL_DATA) public data: DialogData,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    super();
    this.buttons = mapDialogDataButtonToInternal(data.buttons);
  }

  buttons: DialogDataButtonInternal[];
  loading = false;
  readonly dialogType = DialogType;
  readonly typesWithoutIcon = [DialogType.confirm, DialogType.info];
  readonly trackById = trackById;

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

  private _isAnyButtonLoading(): boolean {
    return this.buttons.some(button => button.loading);
  }

  private _setLoading(id: number, loading: boolean): void {
    this.buttons = this.buttons.map(button => {
      const key: keyof Pick<DialogDataButtonInternal, 'loading' | 'disabled'> =
        button.id === id ? 'loading' : 'disabled';
      return { ...button, [key]: loading };
    });
    this.changeDetectorRef.markForCheck();
  }

  private _processBackdropObservable(observable: Observable<any>): void {
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    observable
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        }),
        tap(() => {
          this.modalRef.close();
        })
      )
      .subscribe();
  }

  private _processButtonObservable(observable: Observable<any>, id: number): void {
    this._setLoading(id, true);
    observable
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        finalize(() => {
          this._setLoading(id, false);
        }),
        tap(() => {
          this.modalRef.close();
        })
      )
      .subscribe();
  }

  btnAction(button: DialogDataButtonInternal): void {
    if (!button.action) {
      this.modalRef.close(false);
      return;
    }
    const possibleObservable = isFunction(button.action) ? button.action(this.modalRef) : button.action;
    if (isObservable(possibleObservable)) {
      this._processButtonObservable(possibleObservable, button.id);
    } else if (possibleObservable === true) {
      this.modalRef.close(true);
    }
  }

  ngOnInit(): void {
    this.modalRef.onBackdropClick$
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !this._isAnyButtonLoading())
      )
      .subscribe(() => {
        const backdropAction = isFunction(this.data.backdropAction)
          ? this.data.backdropAction(this.modalRef)
          : this.data.backdropAction;
        if (isNotNil(backdropAction)) {
          if (isObservable(backdropAction)) {
            this._processBackdropObservable(backdropAction);
          } else if (isBoolean(backdropAction)) {
            this.modalRef.close(backdropAction);
          }
        } else {
          const buttonWithBackdropAction = this.buttons.find(button => button.backdropAction);
          if (buttonWithBackdropAction) {
            this.btnAction(buttonWithBackdropAction);
          } else if (!this.data.disableDefaultBackdropAction) {
            if (this.buttons.length) {
              this.btnAction(this.buttons[0]);
            } else {
              this.modalRef.close();
            }
          }
        }
      });
  }
}

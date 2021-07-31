import { ChangeDetectionStrategy, Component, HostBinding, Inject, OnInit } from '@angular/core';
import { ModalRef } from '../modal-ref';
import { finalize, isObservable, Observable, take, takeUntil, tap } from 'rxjs';
import { MODAL_DATA } from '../modal.config';
import { isBoolean, isFunction, isNotNil, isString } from 'st-utils';
import { LocalState } from '@stlmpp/store';
import { DialogData, DialogDataButton, DialogDataButtonType } from '@shared/components/modal/dialog/dialog-data';
import { DialogType } from '@shared/components/modal/dialog/dialog-type.enum';
import { trackById } from '@util/track-by';

let uid = 1;

interface DialogDataButtonInternal extends DialogDataButton {
  id: number;
  disabled: boolean;
  loading: boolean;
}

interface DialogComponentState {
  buttons: DialogDataButtonInternal[];
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
export class DialogComponent extends LocalState<DialogComponentState> implements OnInit {
  constructor(
    private modalRef: ModalRef<DialogComponent, DialogData, boolean>,
    @Inject(MODAL_DATA) public data: DialogData
  ) {
    super({ buttons: mapDialogDataButtonToInternal(data.buttons), loading: false });
  }

  readonly loading$ = this.selectState('loading');
  readonly buttons$ = this.selectState('buttons');
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

  private _setLoading(id: number, loading: boolean): void {
    this.updateState(state => ({
      ...state,
      buttons: state.buttons.map(button => {
        const key: keyof Pick<DialogDataButtonInternal, 'loading' | 'disabled'> =
          button.id === id ? 'loading' : 'disabled';
        return { ...button, [key]: loading };
      }),
    }));
  }

  private _processBackdropObservable(observable: Observable<any>): void {
    this.updateState({ loading: true });
    observable
      .pipe(
        take(1),
        takeUntil(this.destroy$),
        finalize(() => {
          this.updateState({ loading: false });
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
    this.modalRef.onBackdropClick$.pipe(takeUntil(this.destroy$)).subscribe(() => {
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
        const buttons = this.getState('buttons');
        const buttonWithBackdropAction = buttons.find(button => button.backdropAction);
        if (buttonWithBackdropAction) {
          this.btnAction(buttonWithBackdropAction);
        } else if (!this.data.disableDefaultBackdropAction) {
          if (buttons.length) {
            this.btnAction(buttons[0]);
          } else {
            this.modalRef.close();
          }
        }
      }
    });
  }
}

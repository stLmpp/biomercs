import { OverlayRef } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { hasModifierKey } from '@angular/cdk/keycodes';
import { ModalConfig } from './modal.config';
import { Key } from '@model/enum/key';

export class ModalRef<T = any, D = any, R = any> {
  constructor(
    public readonly id: string,
    private readonly overlayRef: OverlayRef,
    private readonly modalConfig: ModalConfig
  ) {
    this._init();
  }

  componentInstance?: T;
  data!: D | null;

  onClose$ = new Subject<R | null>();

  private _init(): void {
    this.overlayRef
      .backdropClick()
      .pipe(take(1))
      .subscribe(() => {
        if (!this.modalConfig.disableClose) {
          this.close();
        }
      });
    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => event.key === Key.Escape && !this.modalConfig.disableClose && !hasModifierKey(event)),
        take(1)
      )
      .subscribe(() => {
        this.close();
      });
  }

  close(value?: R): void {
    this.overlayRef.detach();
    this.onClose$.next(value);
    this.onClose$.complete();
  }
}

import { OverlayRef } from '@angular/cdk/overlay';
import { filter, Subject, take } from 'rxjs';
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
  disableClose = this.modalConfig.disableClose;

  readonly onClose$ = new Subject<R | null | undefined>();
  readonly onBackdropClick$ = new Subject<MouseEvent>();

  private _init(): void {
    this.overlayRef
      .backdropClick()
      .pipe(take(1))
      .subscribe($event => {
        if (!this.disableClose) {
          this.close();
        }
        this.onBackdropClick$.next($event);
        this.onBackdropClick$.complete();
      });
    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => !this.disableClose && event.key === Key.Escape && !hasModifierKey(event)),
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

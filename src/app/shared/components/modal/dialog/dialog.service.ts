import { Injectable } from '@angular/core';
import { ModalService } from '../modal.service';
import { ModalRef } from '../modal-ref';
import { DialogComponent, DialogData, DialogType } from './dialog.component';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DynamicLoaderService } from '../../../../core/dynamic-loader.service';
import { ModalConfig } from '@shared/components/modal/modal.config';

export type DialogRef = ModalRef<DialogComponent, DialogData, boolean>;

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private modalService: ModalService, private dynamicLoaderService: DynamicLoaderService) {}

  private async _getModalRef(data: DialogData, config?: ModalConfig<DialogData>): Promise<DialogRef> {
    await this.dynamicLoaderService.loadModule(() => import('./dialog.module').then(m => m.DialogModule));
    return this.modalService.openLazy(() => import('./dialog.component').then(c => c.DialogComponent), {
      ...config,
      panelClass: 'dialog',
      data: { btnYes: 'Yes', btnNo: 'No', ...data },
    });
  }

  confirm(data: DialogData, config?: ModalConfig): Observable<boolean> {
    return from(this._getModalRef({ ...data, type: DialogType.confirm }, config)).pipe(
      switchMap(modalRef => modalRef.onClose$.pipe(map(Boolean)))
    );
  }

  async info(data: DialogData, config?: ModalConfig): Promise<DialogRef> {
    return this._getModalRef({ ...data, type: DialogType.info }, config);
  }

  async success(data: DialogData, config?: ModalConfig): Promise<DialogRef> {
    return this._getModalRef({ ...data, type: DialogType.success }, config);
  }
}

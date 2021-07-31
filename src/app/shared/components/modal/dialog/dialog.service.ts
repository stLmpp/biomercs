import { Injectable } from '@angular/core';
import { ModalService } from '../modal.service';
import { ModalRef } from '../modal-ref';
import { DialogComponent } from './dialog.component';
import { from, map, Observable, switchMap } from 'rxjs';
import { DynamicLoaderService } from '../../../../core/dynamic-loader.service';
import { ModalConfig } from '@shared/components/modal/modal.config';
import { DialogData } from '@shared/components/modal/dialog/dialog-data';
import { DialogType } from '@shared/components/modal/dialog/dialog-type.enum';

export type DialogRef = ModalRef<DialogComponent, DialogData, boolean>;

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private modalService: ModalService, private dynamicLoaderService: DynamicLoaderService) {}

  private async _getModalRef(data: DialogData, config?: Partial<ModalConfig<DialogData>>): Promise<DialogRef> {
    await this.dynamicLoaderService.loadModule(() => import('./dialog.module').then(m => m.DialogModule));
    return this.modalService.openLazy(() => import('./dialog.component').then(c => c.DialogComponent), {
      ...config,
      panelClass: 'dialog',
      data,
      disableClose: true,
    });
  }

  confirm(data: DialogData, config?: Partial<ModalConfig<DialogData>>): Observable<boolean> {
    return from(this._getModalRef({ ...data, type: DialogType.confirm }, config)).pipe(
      switchMap(modalRef => modalRef.onClose$.pipe(map(Boolean)))
    );
  }

  async info(data: DialogData, config?: Partial<ModalConfig<DialogData>>): Promise<DialogRef> {
    return this._getModalRef({ ...data, type: DialogType.info }, { maxWidth: 500, ...config });
  }

  async success(data: DialogData, config?: Partial<ModalConfig<DialogData>>): Promise<DialogRef> {
    return this._getModalRef({ ...data, type: DialogType.success }, { maxWidth: 500, ...config });
  }

  async error(data: DialogData, config?: Partial<ModalConfig<DialogData>>): Promise<DialogRef> {
    return this._getModalRef({ ...data, type: DialogType.error }, { maxWidth: 500, ...config });
  }
}

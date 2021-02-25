import { Injectable } from '@angular/core';
import { ModalService } from '../modal.service';
import { ModalRef } from '../modal-ref';
import { DialogComponent, DialogData } from './dialog.component';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DynamicLoaderService } from '../../../../core/dynamic-loader.service';

@Injectable({ providedIn: 'root' })
export class DialogService {
  constructor(private modalService: ModalService, private dynamicLoaderService: DynamicLoaderService) {}

  private async _getModalRef(data: DialogData): Promise<ModalRef<DialogComponent, DialogData, boolean>> {
    await this.dynamicLoaderService.loadModule(() => import('./dialog.module').then(m => m.DialogModule));
    return this.modalService.openLazy(() => import('./dialog.component').then(c => c.DialogComponent), {
      panelClass: 'dialog',
      data: { btnYes: 'Yes', btnNo: 'No', ...data },
    });
  }

  confirm(data: DialogData): Observable<boolean> {
    return from(this._getModalRef(data)).pipe(switchMap(modalRef => modalRef.onClose$.pipe(map(Boolean))));
  }
}

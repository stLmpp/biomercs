import { SafeHtml } from '@angular/platform-browser';
import { ModalRef } from '@shared/components/modal/modal-ref';
import { Observable } from 'rxjs';
import { BioSize, BioType } from '@shared/components/core/types';
import { DialogComponent } from '@shared/components/modal/dialog/dialog.component';
import { DialogType } from '@shared/components/modal/dialog/dialog-type.enum';

export type DialogDataAction =
  | ((modalRef: ModalRef<DialogComponent, DialogData, boolean>) => any)
  | Observable<any>
  | boolean;

export interface DialogDataButton {
  title: string;
  size?: BioSize;
  type?: BioType;
  action?: DialogDataAction;
  backdropAction?: boolean;
}

export type DialogDataButtonType = DialogDataButton | string;

export interface DialogData {
  title?: string | null;
  content: string | SafeHtml;
  type?: DialogType;
  buttons?: DialogDataButtonType[];
  backdropAction?: DialogDataAction;
  disableDefaultBackdropAction?: boolean;
}

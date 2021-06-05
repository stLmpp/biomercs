import { NgModule } from '@angular/core';
import { ModalModule } from '../modal.module';
import { DialogComponent } from './dialog.component';
import { ButtonModule } from '../../button/button.module';
import { CommonModule } from '@angular/common';
import { IconModule } from '@shared/components/icon/icon.module';
import { StUtilsArrayModule } from '@stlmpp/utils';

const DECLARATIONS = [DialogComponent];
const MODULES = [
  CommonModule,
  ModalModule.forChild({
    disableClose: true,
    width: 500,
  }),
  ButtonModule,
  IconModule,
  StUtilsArrayModule,
];
const EXPORTS = [ModalModule, ButtonModule, IconModule, StUtilsArrayModule];

@NgModule({
  declarations: [...DECLARATIONS],
  imports: [...MODULES],
  exports: [...DECLARATIONS, ...EXPORTS],
})
export class DialogModule {}

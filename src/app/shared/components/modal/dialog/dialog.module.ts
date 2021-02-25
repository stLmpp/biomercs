import { NgModule } from '@angular/core';
import { ModalModule } from '../modal.module';
import { DialogComponent } from './dialog.component';
import { ButtonModule } from '../../button/button.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, ModalModule.forChild({ disableClose: true, width: 500 }), ButtonModule],
  declarations: [DialogComponent],
  exports: [DialogComponent],
})
export class DialogModule {}

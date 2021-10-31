import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumTopicTransferComponent } from './forum-topic-transfer.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { ButtonModule } from '@shared/components/button/button.module';
import { ListModule } from '@shared/components/list/list.module';
import { StControlModelModule } from '@stlmpp/control';

@NgModule({
  declarations: [ForumTopicTransferComponent],
  imports: [CommonModule, ModalModule, ButtonModule, ListModule, StControlModelModule],
})
export class ForumTopicTransferModule {}

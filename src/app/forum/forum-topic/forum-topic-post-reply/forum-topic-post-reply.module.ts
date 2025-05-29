import { NgModule } from '@angular/core';
import { ForumTopicPostReplyComponent } from './forum-topic-post-reply.component';
import { ModalModule } from '@shared/components/modal/modal.module';
import { StControlModule } from '@stlmpp/control';
import { FormModule } from '@shared/components/form/form.module';

import { ButtonModule } from '@shared/components/button/button.module';

@NgModule({
  imports: [ModalModule, StControlModule, FormModule, ButtonModule, ForumTopicPostReplyComponent],
})
export class ForumTopicPostReplyModule {}

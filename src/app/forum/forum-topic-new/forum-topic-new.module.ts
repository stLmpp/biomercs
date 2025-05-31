import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ForumTopicNewRoutingModule } from './forum-topic-new-routing.module';
import { ForumTopicNewComponent } from './forum-topic-new.component';
import { CardModule } from '@shared/components/card/card.module';
import { StControlModule } from '@stlmpp/control';
import { ButtonModule } from '@shared/components/button/button.module';
import { FormModule } from '@shared/components/form/form.module';

@NgModule({
  imports: [
    CommonModule,
    ForumTopicNewRoutingModule,
    CardModule,
    StControlModule,
    ButtonModule,
    FormModule,
    ForumTopicNewComponent,
  ],
})
export class ForumTopicNewModule {}

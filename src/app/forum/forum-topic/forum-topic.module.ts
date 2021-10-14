import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumTopicComponent } from './forum-topic.component';
import { ForumTopicRoutingModule } from './forum-topic-routing.module';
import { StControlModelModule, StControlModule } from '@stlmpp/control';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ForumTopicPostComponent } from './forum-topic-post/forum-topic-post.component';
import { FormModule } from '@shared/components/form/form.module';
import { FlagModule } from '@shared/components/icon/flag/flag.module';
import { AsyncDefaultModule } from '@shared/async-default/async-default.module';
import { CKEditorModule } from '@shared/ckeditor/ckeditor.module';
import { ForumTopicPostReplyComponent } from './forum-topic-post-reply/forum-topic-post-reply.component';

@NgModule({
  declarations: [ForumTopicComponent, ForumTopicPostComponent, ForumTopicPostReplyComponent],
  imports: [
    CommonModule,
    ForumTopicRoutingModule,
    StControlModelModule,
    CardModule,
    PaginationModule,
    FormModule,
    FlagModule,
    StControlModule,
    AsyncDefaultModule,
    CKEditorModule,
  ],
})
export class ForumTopicModule {}

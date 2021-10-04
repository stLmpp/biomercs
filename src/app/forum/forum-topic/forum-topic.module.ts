import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumTopicComponent } from './forum-topic.component';
import { ForumTopicRoutingModule } from './forum-topic-routing.module';
import { StControlModelModule, StControlModule } from '@stlmpp/control';
import { BioQuillModule } from '@shared/quill/quill.module';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ForumTopicPostComponent } from './forum-topic-post/forum-topic-post.component';
import { FormModule } from '@shared/components/form/form.module';
import { FlagModule } from '@shared/components/icon/flag/flag.module';

@NgModule({
  declarations: [ForumTopicComponent, ForumTopicPostComponent],
  imports: [
    CommonModule,
    ForumTopicRoutingModule,
    BioQuillModule,
    StControlModelModule,
    CardModule,
    PaginationModule,
    FormModule,
    FlagModule,
    StControlModule,
  ],
})
export class ForumTopicModule {}

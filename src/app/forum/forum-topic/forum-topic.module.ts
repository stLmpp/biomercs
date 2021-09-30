import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumTopicComponent } from './forum-topic.component';
import { ForumTopicRoutingModule } from './forum-topic-routing.module';
import { StControlModelModule } from '@stlmpp/control';
import { BioQuillModule } from '@shared/quill/quill.module';
import { CardModule } from '@shared/components/card/card.module';
import { PaginationModule } from '@shared/components/pagination/pagination.module';
import { ForumTopicPostComponent } from './forum-topic-post/forum-topic-post.component';

@NgModule({
  declarations: [ForumTopicComponent, ForumTopicPostComponent],
  imports: [CommonModule, ForumTopicRoutingModule, BioQuillModule, StControlModelModule, CardModule, PaginationModule],
})
export class ForumTopicModule {}

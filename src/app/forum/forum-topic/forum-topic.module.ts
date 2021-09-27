import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumTopicComponent } from './forum-topic.component';
import { ForumTopicRoutingModule } from './forum-topic-routing.module';

@NgModule({
  declarations: [ForumTopicComponent],
  imports: [CommonModule, ForumTopicRoutingModule],
})
export class ForumTopicModule {}

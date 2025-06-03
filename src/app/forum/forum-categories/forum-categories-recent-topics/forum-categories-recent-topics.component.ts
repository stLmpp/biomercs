import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TopicRecent } from '@model/forum/topic';
import { trackByFactory } from '@stlmpp/utils';

@Component({
  selector: 'bio-forum-categories-recent-topics',
  templateUrl: './forum-categories-recent-topics.component.html',
  styleUrls: ['./forum-categories-recent-topics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumCategoriesRecentTopicsComponent {
  @Input() recentTopics: TopicRecent[] = [];

  readonly trackBy = trackByFactory<TopicRecent>('id');
}

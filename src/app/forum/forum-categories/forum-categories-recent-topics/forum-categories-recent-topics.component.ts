import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TopicRecent } from '@model/forum/topic';
import { trackById } from '@util/track-by';

@Component({
    selector: 'bio-forum-categories-recent-topics',
    templateUrl: './forum-categories-recent-topics.component.html',
    styleUrls: ['./forum-categories-recent-topics.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ForumCategoriesRecentTopicsComponent {
  @Input() recentTopics: TopicRecent[] = [];

  readonly trackBy = trackById;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Topic } from '@model/forum/topic';

@Component({
  selector: 'a[bioForumSubCategoryTopic]',
  templateUrl: './forum-sub-category-topic.component.html',
  styleUrls: ['./forum-sub-category-topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid-container' },
})
export class ForumSubCategoryTopicComponent {
  @Input() topic!: Topic;
}

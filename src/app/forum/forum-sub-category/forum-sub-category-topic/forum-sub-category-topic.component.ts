import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { mdiPin, mdiPinOff } from '@mdi/js';
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

  @HostBinding('class.is-moderator')
  get isModerator(): boolean {
    return this.topic.isModerator;
  }

  readonly mdiPin = mdiPin;
  readonly mdiPinOff = mdiPinOff;

  onLockUnlock(): void {}
}

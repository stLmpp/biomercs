import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { mdiPin, mdiPinOff } from '@mdi/js';
import { Topic } from '@model/forum/topic';
import { TopicService } from '../../service/topic.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'a[bioForumSubCategoryTopic]',
  templateUrl: './forum-sub-category-topic.component.html',
  styleUrls: ['./forum-sub-category-topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid-container' },
})
export class ForumSubCategoryTopicComponent {
  constructor(private topicService: TopicService, private changeDetectorRef: ChangeDetectorRef) {}

  @Input() topic!: Topic;

  @Output() readonly topicChange = new EventEmitter<Topic>();
  @Output() readonly reloadSubCategory = new EventEmitter<void>();

  @HostBinding('class.is-moderator')
  get isModerator(): boolean {
    return this.topic.isModerator;
  }

  readonly mdiPin = mdiPin;
  readonly mdiPinOff = mdiPinOff;

  locking = false;
  pinning = false;

  onLockUnlock($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.locking = true;
    const isLocked = !!this.topic.lockedDate;
    const newLockedDate = isLocked ? null : new Date();
    const http$ = isLocked
      ? this.topicService.unlock(this.topic.idSubCategory, this.topic.id)
      : this.topicService.lock(this.topic.idSubCategory, this.topic.id);
    http$
      .pipe(
        finalize(() => {
          this.locking = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.topicChange.emit({ ...this.topic, lockedDate: newLockedDate });
      });
  }

  onPinUnpin($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.pinning = true;
    const http$ = this.topic.pinned
      ? this.topicService.unpin(this.topic.idSubCategory, this.topic.id)
      : this.topicService.pin(this.topic.idSubCategory, this.topic.id);
    http$
      .pipe(
        finalize(() => {
          this.pinning = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.reloadSubCategory.emit();
      });
  }
}

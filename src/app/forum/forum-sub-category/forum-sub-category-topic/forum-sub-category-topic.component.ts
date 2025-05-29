import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, inject, input, output } from '@angular/core';
import { mdiPin, mdiPinOff } from '@mdi/js';
import { Topic } from '@model/forum/topic';
import { TopicService } from '../../service/topic.service';
import { finalize } from 'rxjs';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { TooltipDirective } from '../../../shared/components/tooltip/tooltip.directive';
import { IconMdiComponent } from '../../../shared/components/icon/icon-mdi.component';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthDateFormatPipe } from '../../../auth/shared/auth-date-format.pipe';

@Component({
  selector: 'a[bioForumSubCategoryTopic]',
  templateUrl: './forum-sub-category-topic.component.html',
  styleUrls: ['./forum-sub-category-topic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'grid-container' },
  imports: [
    IconComponent,
    ButtonComponent,
    TooltipDirective,
    IconMdiComponent,
    RouterLink,
    DecimalPipe,
    AuthDateFormatPipe,
  ],
})
export class ForumSubCategoryTopicComponent {
  private topicService = inject(TopicService);
  private changeDetectorRef = inject(ChangeDetectorRef);


  readonly topic = input.required<Topic>();

  readonly topicChange = output<Topic>();
  readonly reloadSubCategory = output<void>();

  @HostBinding('class.is-moderator')
  get isModerator(): boolean {
    return this.topic().isModerator;
  }

  readonly mdiPin = mdiPin;
  readonly mdiPinOff = mdiPinOff;

  locking = false;
  pinning = false;

  onLockUnlock($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.locking = true;
    const isLocked = !!this.topic().lockedDate;
    const newLockedDate = isLocked ? null : new Date();
    const http$ = isLocked
      ? this.topicService.unlock(this.topic().idSubCategory, this.topic().id)
      : this.topicService.lock(this.topic().idSubCategory, this.topic().id);
    http$
      .pipe(
        finalize(() => {
          this.locking = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        this.topicChange.emit({ ...this.topic(), lockedDate: newLockedDate });
      });
  }

  onPinUnpin($event: MouseEvent): void {
    $event.stopPropagation();
    $event.preventDefault();
    this.pinning = true;
    const topic = this.topic();
    const http$ = topic.pinned
      ? this.topicService.unpin(topic.idSubCategory, topic.id)
      : this.topicService.pin(topic.idSubCategory, topic.id);
    http$
      .pipe(
        finalize(() => {
          this.pinning = false;
          this.changeDetectorRef.markForCheck();
        })
      )
      .subscribe(() => {
        // TODO: The 'emit' function requires a mandatory void argument
        this.reloadSubCategory.emit();
      });
  }
}
